import { basename } from 'node:path';
import { Cheerio, CheerioAPI } from 'cheerio';
import { AnyNode } from 'domhandler';
import levenshtein from 'fast-levenshtein';

import { htmlToText, nextElement, replaceNode } from '../../html.js';
import { DEFAULT_RECORD, GetRecords, SearchRecord } from '../records.js';

function dropBreadcrumbs($: CheerioAPI, article: Cheerio<AnyNode>): string[] {
    const breadcrumbsNode = article.find('.breadcrumbs').remove();

    const breadcrumbs = [...breadcrumbsNode.find('a')]
        .map(function mapBreadcrumbs(el) {
            return $(el).text();
        });

    const first = breadcrumbs?.[0];

    if (first === 'kotlin-stdlib' || first === 'kotlin-test' || first === 'kotlin-reflect')
        breadcrumbs.shift();

    const libraryPrefix = process.env.ALGOLIA_INDEX_NAME?.replace(/-stag(e|ing)$/, '');

    if (libraryPrefix) {
        while (breadcrumbs[0] === libraryPrefix) {
            breadcrumbs.shift();
        }
    }

    return breadcrumbs;
}

function dropTitleNode(article: Cheerio<AnyNode>) {
    let titleNode = article.find('.cover > h1.cover');

    if (titleNode.length > 1)
        console.error(`err: api package has two headers unexpectedly`);

    return titleNode.remove().text();
}

async function dropAllTypes($: CheerioAPI, article: Cheerio<AnyNode>) {
    const indexHeader = article.find('h2:contains("Index"):has(+ a[href*="all-types.html"])');
    if (indexHeader?.length > 0) {
        const titles = indexHeader.filter(function filterIndexTitle(_i, el) {
            return $(el).text().trim() === 'Index';
        });

        const links = titles.find('+ a[href*="all-types.html"]');

        if (titles.length !== links.length)
            throw new Error(`dropAllTypes: links and titles are not equal: ${titles.length} !== ${links.length}`);

        titles.remove();
        links.remove();
    }
}

async function dropWorkingElements($article: Cheerio<AnyNode>) {
    $article.find([
        ':is(.clearfix,.floating-right):has(a[href*="https://github.com"]:contains("source"))', // Drop (source) links
        '.platform-bookmarks-row', // Platform tabs
        '.copy-icon, .copy-popup-wrapper', // copy icon
        '.kdoc-tag:has(h4:contains("Since Kotlin"))' // Since Kotlin section
    ].join(',')).remove();
}

async function dropInheritors($: CheerioAPI, $article: Cheerio<AnyNode>) {
    const headers = $article.find('h4:contains("Inheritors")');

    for (const title of headers) {
        const $next = $(nextElement(title));
        if ($next.is('.table')) {
            $next.remove();
            $(title).remove();
        }
    }
}

async function replaceInternalLinks($article: Cheerio<AnyNode>, pageUrl: URL) {
    replaceNode($article, 'a', ($node, attrs, content) => {
        const href = $node.attr('href');
        const link = new URL(href, pageUrl);

        const isEntityLink = (
            (link.hostname == pageUrl.hostname && link.pathname.startsWith('/api/')) ||
            (link.hostname === 'docs.oracle.com' && link.pathname.includes('/docs/api/')) ||
            (link.hostname === 'projectreactor.io' && link.pathname.includes('/docs/core/')) ||
            (
                link.pathname.includes('javadoc/') &&
                (link.hostname.endsWith('reactive-streams.org') || link.hostname === 'reactivex.io')
            ) ||
            (link.hostname === 'developer.mozilla.org' && (
                link.pathname.includes('/docs/Web/JavaScript/Reference/') ||
                link.pathname.includes('/docs/Web/API/')
            ))
        );

        if (isEntityLink) return `<a ${attrs}><code>${content}</code></a>`;
    });
}


async function replaceDokkaSemantic(node: Cheerio<AnyNode>) {
    replaceNode(node, '.symbol.monospace', (_$node, attrs, content) => (
        `<code ${attrs}>${content}</code>`
    ));
    replaceNode(node, 'u', (_$node, attrs, content) => (
        `<code ${attrs}>${content}</code>`
    ));
}

async function replacePlatformDuplicate($: CheerioAPI, article: Cheerio<AnyNode>) {
    const definition = article.find(':is(.content.sourceset-dependent-content)');

    definition.find('.token').filter(function filterPlatformTokens(_i, el) {
        const text = $(el).text().trim();
        return text === 'actual' || text === 'expect' || text === 'external';
    }).remove();

    if (definition.length > 1) {
        const list: string[] = [];

        for (const el of definition) {
            const text = (await htmlToText($, [el.firstChild]));

            const isUnique = list.every(function calcTextsCorrelation(previous) {
                const diff = levenshtein.get(previous, text);
                const k = Math.ceil((previous.length + text.length) / diff);
                return diff > 1 && k < 3;
            });

            if (isUnique) list.push(text);
            else $(el).remove();
        }
    }
}

async function contentNodesImprove($: CheerioAPI, article: Cheerio<AnyNode>, pageUrl: URL) {
    await dropAllTypes($, article);
    await dropWorkingElements(article);
    await dropInheritors($, article);
    await replacePlatformDuplicate($, article);
    await replaceInternalLinks(article, pageUrl);
    await replaceDokkaSemantic(article);
}

async function apiReference($: CheerioAPI, url: string) {
    const pageUrl = 'https://kotlinlang.org/'; // new URL($('meta[property="og:url"][content]').attr('content'));
    const finalUrl = '/' + url;
    const normalizedUrl = new URL(finalUrl, pageUrl);

    const $article = $('#main');
    let title = dropTitleNode($article);
    let content = '';

    if (url.match(/\/kotlin-stdlib\/(all-types\.html)?$/)) title = 'Kotlin Standard Library';
    else if (url.match(/\/kotlin-test\/(all-types\.html)?$/)) title = 'Kotlin Test';
    else if (url.match(/\/kotlin-reflect\/(all-types\.html)?$/)) title = 'Kotlin JVM reflection extensions';

    if (url.endsWith('/all-types.html')) {
        content = `All types for ${title}`;
        title += ' (alltypes)';
    }

    if ($article.is(':has(> .main-content[data-page-type="package"])')) {
        title = $article.find('.breadcrumbs .current').text();
    }

    if (url.endsWith('.html')) {
        // special for platform like:
        //   "/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/[js]as-promise.html"
        const platform = basename(url).match(/^\[([a-zA-Z-]+)].+/)?.[1]?.trim();
        if (platform && platform !== 'common') title += ' (' + platform + ')';
    }

    if (!content) {
        const elements = $article.find('div.cover, div.cover + .platform-hinted');

        if (elements.length) {
            // Pre-process elements markup for better index
            await contentNodesImprove($, elements, normalizedUrl);

            elements.find('.symbol.monospace .block').append($('<span> </span>'));
            content = await htmlToText($, [...elements].map(el => el.firstChild));
        }
    }

    let breadcrumbs = [...dropBreadcrumbs($, $article), title];

    const [item1, item2] = breadcrumbs.slice(-2);

    // is page <constructor>?
    if (item1?.match(/^[A-Z]/) && item1 === item2) {
        // Double-check
        if ($article.find('.main-content[data-page-type="member"]').length) {
            breadcrumbs.pop();
            breadcrumbs[breadcrumbs.length - 1] = `${item1} &lt;constructor&gt;`;
        }
    }

    // is page *.Companion without additional content?
    if (breadcrumbs[breadcrumbs.length - 1] === 'Companion' && content === '`object Companion`')
        return [];

    // Replace "SomeClass > Companion" => "SomeClass.Companion"
    breadcrumbs = breadcrumbs.reduce(function joinCompanionTitle(result, item) {
        if (item === 'Companion') result[result.length - 1] = `${result[result.length - 1]}.${item}`;
        else result.push(item);
        return result;
    }, []);

    const mainTitle = breadcrumbs.join(' \u203a ');

    const result: SearchRecord = {
        ...DEFAULT_RECORD,

        objectID: finalUrl.replace(/\.html$/g, ''),
        url: normalizedUrl.toString(),
        parent: finalUrl,

        headings: breadcrumbs.length ? breadcrumbs.reverse().join(' | ') : title,
        mainTitle,
        pageTitle: mainTitle,

        content
    };

    return [result];
}

export const Page_API: GetRecords = apiReference;
