import { AnyNode, Node } from 'domhandler';
import { Cheerio, CheerioAPI } from 'cheerio';

import { findPrevElementWith, htmlToText, nextElement } from '../../html.js';
import { DEFAULT_RECORD, GetRecords, SearchRecord } from '../records.js';

function isFinalNode<T extends Node & { tagName?: string }>(node: T, level: number): boolean {
    return level === 0 && /^h[3-9]$/gi.test(node.tagName);
}

function dropSourceLinks(article: Cheerio<AnyNode>) {
    article.find('a[href*="https://github.com"]:contains("source\\)")').remove();
}

function dropPlatformSwitches(article: Cheerio<AnyNode>) {
    article.find('div[data-kotlin-version][data-platform] > .tags').remove();
}

function dropBreadcrumbs($: CheerioAPI, article: Cheerio<AnyNode>): [text: string, url: string][] {
    const breadcrumbsNode = article.find('.api-docs-breadcrumbs').remove();

    const breadcrumbs = [...breadcrumbsNode.find('a')]
        .map(function mapBreadcrumbs(el): [text: string, url: string] {
            const $el = $(el);
            return [$el.text(), $el.attr('href')];
        });

    const first = breadcrumbs?.[0]?.[0];

    if (first === 'kotlin-stdlib' || first === 'kotlin.test')
        breadcrumbs.shift();

    return breadcrumbs;
}

const SIGNATURE_SELECTOR = 'div[data-kotlin-version][data-platform]:has(> .signature)';

function isSignatureDescriptionNode<T extends Node & { tagName?: string }>(child: T): boolean {
    return !child.tagName || child.tagName === 'p';
}

function swapSignatureCodeAndText($: CheerioAPI, article: Cheerio<AnyNode>) {
    const signatures = article.find(SIGNATURE_SELECTOR);

    for (const signature of signatures) {
        const nextNode = nextElement(signature);

        /* Filter empty and description with code samples.
           Cause code samples less interesting than signature? */
        const hasDescription = Boolean(nextNode && $(nextNode).is('div[data-kotlin-version][data-platform]:has(> p)') &&
            nextNode.childNodes.every(isSignatureDescriptionNode));

        if (hasDescription) {
            /* if description for more than one signature, we put it before first.
               see: https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-contains.html#kotlin.test$assertContains(kotlin.ranges.IntRange,%20kotlin.Int,%20kotlin.String?) */

            const node = findPrevElementWith(nextNode, node => !$(node).is(SIGNATURE_SELECTOR))?.nextSibling;
            const firstSignature = (node && node !== nextNode && $(node).is(SIGNATURE_SELECTOR) && node) || null;

            if (firstSignature) {
                /* move description before all signatures */
                const description = $(nextNode).remove();
                description.insertBefore(firstSignature);
            }
        }
    }
}

function findTitleNode(article: Cheerio<AnyNode>) {
    let titleNode = article.find('h1[id]');
    const packageTitle = article.find('h2[id^=package-]');

    if (packageTitle.length) titleNode = packageTitle;

    /**
     * API is not a package, no page title:
     *  check h2 heading. See: https://kotlinlang.org/api/latest/jvm/stdlib/
     */
    if (!titleNode.length)
        titleNode = article.find('h2[id]');

    if (titleNode.length > 1)
        console.error(`err: legacy api package has two headers unexpectedly`);

    return titleNode;
}

async function legacyApi($: CheerioAPI, url: string) {
    let content: string | null = null;

    const $article = $('.page-content');
    const pageUrl = new URL($('meta[property="og:url"][content]').attr('content'));

    if (!$article.length) {
        console.warn(`skip: /${url} with unexpected page dom!!!`);
        return [];
    }

    dropPlatformSwitches($article);
    dropSourceLinks($article);
    // ToDo: enable when filters with api to be in search UI
    // swapSignatureCodeAndText($, $article);

    const levels = dropBreadcrumbs($, $article);

    const $titleNode = findTitleNode($article);

    if ($titleNode.length)
        content = await htmlToText($, [$titleNode[0].nextSibling], isFinalNode);
    else {
        // check extension page like: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/java.time.-duration/
        const isExtensionPage = $article.find('> *:first-child').eq(0).is('h3[id^="extensions-for-"]');
        if (!isExtensionPage) {
            throw new Error(`Title for ${url} not found!`);
        }
    }

    const breadcrumbs = levels.map(([text]) => text);

    let title = levels.length ?
        breadcrumbs.join(' \u203a ') :
        $titleNode.text();

    if (url.endsWith('/alltypes/')) {
        content = `All types for ${title}`;
        title += ' (alltypes)';
    }

    const finalUrl = '/' + url;

    const result: SearchRecord = {
        ...DEFAULT_RECORD,

        objectID: finalUrl.replace(/\.html$/g, ''),
        parent: finalUrl,
        url: new URL(finalUrl, pageUrl).toString(),

        headings: breadcrumbs.length ? breadcrumbs.reverse().join(' | ') : title,
        mainTitle: title,
        pageTitle: title,

        content
    };

    return [result];
}

export const Page_API_stdlib: GetRecords = legacyApi;
export const Page_API_test: GetRecords = legacyApi;
