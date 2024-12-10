import { AnyNode, Element, Node } from 'domhandler';
import { Cheerio, CheerioAPI } from 'cheerio';

import { findNextElementWith, htmlToText, replaceNode } from '../../html.js';
import { DEFAULT_RECORD, GetRecords, SearchRecord } from '../records.js';

function getBreadcrumbs(article: Cheerio<AnyNode>): string[] {
    return article.attr('data-breadcrumbs')?.split('///') || [];
}

function dropIrrelevantSections(article: Cheerio<AnyNode>) {
    article.find([
        '.chapter:has(#what-s-next)', '.chapter:has(#next-step)', '.chapter:has(#next-steps)',
        '.chapter:has(#learn-more)', '.chapter:has(#leave-feedback)'
    ].join(', ')).remove();
}

function replaceMedia(article: Cheerio<AnyNode>, pageUrl: string) {
    const videos = article.find('.video-player');

    for (let i = 0, length = videos.length; i < length; i++) {
        const video = videos.eq(i);
        const url = video.find('object[data]').attr('data');
        video.replaceWith(url ? `&lt;${new URL(url, pageUrl).hostname}&gt;` : '&lt;video&gt;');
    }
}

function replaceWRSSemantic(article: Cheerio<AnyNode>) {
    replaceNode(article, 'span.control', (_$node, attrs, content) => (
        `<b ${attrs}>${content}</b>`
    ));

    replaceNode(article, 'div.code-block', (_$node, attrs, content) => (
        `<code ${attrs}>${content}</code>`
    ));
}

function dropUiElements(article: Cheerio<AnyNode>) {
    article.find('.last-modified').remove();
    article.find('.navigation-links').remove();
    article.find('[class*="inline-icon-"]').remove();
}

const TITLE_SELECTOR = '[id]:is(h1, h2, h3, h4)';

type Chapter = {
    titleNode: Element,
    title: string[],
    content: string | null,
}

function pairTitleContent($: CheerioAPI, titleNode: Element): Node {
    let contentNode: Element | null = null;

    /* check title inside collapse */
    const chapterNode = titleNode.parentNode;
    if ($(chapterNode).is('.collapse__title'))
        contentNode = findNextElementWith(chapterNode, el => $(el).is('.collapse__content, .collapse__body'));

    return contentNode || titleNode.nextSibling;
}

async function getIntroduction($: CheerioAPI, article: Cheerio<AnyNode>): Promise<Chapter> {
    const titleNode = article.find(`> ${TITLE_SELECTOR}`)[0];
    const contentNode = pairTitleContent($, titleNode);

    return {
        titleNode,
        title: [$(titleNode).text()],
        content: await htmlToText($, [contentNode], (node, level) =>
            level === 0 && node instanceof Element && $(node).is('section.chapter'))
    };
}

async function getChapters($: CheerioAPI, article: Cheerio<AnyNode>): Promise<Chapter[]> {
    const chapters = article.find('> .chapter');

    return Promise.all(chapters.toArray().map(async function toChapter(chapter): Promise<Chapter> {
        const title = $(chapter).find([
            `> ${TITLE_SELECTOR}`,
            `> .collapse > .collapse__title > ${TITLE_SELECTOR}`
        ].join(','));

        return {
            titleNode: title[0],
            title: [title.text()],
            content: null
        };
    }));
}

function myMainTitle(headings: string[]): string | void {
    return headings.find((title, i, list) => i !== list.length - 1 && (
        title.endsWith('– tutorial') ||
        /advent of code 20\d{2}/i.test(title)
    ));
}

async function extractChapters($: CheerioAPI, article: Cheerio<AnyNode>): Promise<[intro: Chapter, chapters: Chapter[]]> {
    return await Promise.all([
        getIntroduction($, article),
        getChapters($, article)
    ]);
}

async function docs($: CheerioAPI, url: string) {
    const $body = $('body[data-template]');
    const isArtile = $body.attr('data-template') === 'article';

    if (!isArtile) {
        console.log(`skip: /${url} not support for landing layouts`);
        return [];
    }

    const $article = $('article.article');
    const pageUrl = new URL($('meta[property="og:url"]').attr('content'));

    dropUiElements($article);
    dropIrrelevantSections($article);
    replaceWRSSemantic($article);
    replaceMedia($article, pageUrl.toString());

    const breadcrumbs = getBreadcrumbs($body);
    const [pageIntro, chaptersTopLevel] = await extractChapters($, $article);

    const chapters = await Promise.all(
        chaptersTopLevel.map(
            async function toChapter({ title, titleNode }) {
                const $chapterNode = $(titleNode.parentNode);
                const [chapterIntro, chaptersSubLevel] = await extractChapters($, $chapterNode);

                const subChapters = await Promise.all(
                    chaptersSubLevel.map(
                        async function toSubChapter({ title: subTitle, titleNode: subTitleNode }) {
                            const subContentNode = pairTitleContent($, subTitleNode);
                            return {
                                titleNode: subTitleNode,
                                title: [...title, ...subTitle],
                                content: await htmlToText($, [subContentNode])
                            };
                        }
                    )
                );

                return [chapterIntro, ...subChapters];
            }
        )
    );

    const subArticles = [pageIntro].concat(...chapters);

    return Promise.all(subArticles.map(async function toRecord({ title, titleNode, content }) {
        const $titleNode = $(titleNode);
        const id = $titleNode.attr('id');
        const finalUrl = `/${url}#${id}`;

        const pageTitles: string[] = [...pageIntro.title, ...title];
        const headings = [...breadcrumbs, ...pageTitles];

        let mainTitle = myMainTitle(headings);
        let pageTitle = pageTitles.pop();

        if (!mainTitle) {
            // random length, formally depends from UI
            if (pageTitles.join(' ').length < 65) {
                mainTitle = pageIntro.title[0];
                pageTitle = [].concat(title).join(': ');
            } else {
                mainTitle = pageTitles.pop();
                const top = pageTitles.pop();

                if (top && mainTitle.length > top.length)
                    mainTitle = top;
            }
        }

        const result: SearchRecord = {
            ...DEFAULT_RECORD,

            objectID: finalUrl,
            url: new URL(finalUrl, pageUrl).toString(),
            parent: '/' + url,

            headings: headings.reverse().join(' | '),
            mainTitle,
            pageTitle,

            content
        };

        return result;
    }));
}

export const Page_Documentation: GetRecords = docs;
