import { DEFAULT_RECORD, htmlToText } from '../lib/parser.mjs';
import { findNextElementWith } from '../lib/html.mjs';

/** @typedef {import('domhandler').Node} Node */

/** @typedef {import('domhandler').Element} Element */

/**
 * @param {import('cheerio').Cheerio} article
 * @returns {string[]}
 */
function getBreadcrumbs(article) {
    return article.attr('data-breadcrumbs')?.split('///') || [];
}

/**
 * @param {import('cheerio').Cheerio} article
 * @returns {void}
 */
function dropUselessSections(article) {
    article.find([
        '.chapter:has(#what-s-next)', '.chapter:has(#next-step)',
        '.chapter:has(#learn-more)', '.chapter:has(#leave-feedback)'
    ].join(', ')).remove();
}

/**
 * @param {import('cheerio').Cheerio} article
 * @param {string} pageUrl
 * @returns {void}
 */
function replaceMedia(article, pageUrl) {
    const videos = article.find('.video-player');

    for (let i = 0, length = videos.length; i < length; i++) {
        const video = videos.eq(i);
        const url = video.find('object[data]').attr('data');
        video.replaceWith(url ? `&lt;${new URL(url, pageUrl).hostname}&gt;` : '&lt;video&gt;');
    }
}

/**
 * @param {import('cheerio').Cheerio} article
 * @returns {void}
 */
function dropUiElements(article) {
    article.find('.last-modified').remove();
    article.find('.navigation-links').remove();
    article.find('[class*="inline-icon-"]').remove();
}

const TITLE_SELECTOR = '[id]:is(h1, h2, h3, h4)';

/**
 * @typedef {object} Chapter
 * @template {Node} TNode
 *
 * @property {TNode} titleNode
 * @template {string|string[]} TTitle
 *
 * @property {TTitle} title
 * @property {string|null} content
 */

/**
 * @param {import('cheerio').CheerioAPI} $
 * @template {Node} TNode
 * @param {TNode} titleNode
 * @returns {Node}
 */
function pairTitleContent($, titleNode) {
    let contentNode;

    /* check title inside collapse */
    const chapterNode = titleNode.parentNode;
    if ($(chapterNode).is('.collapse__title'))
        contentNode = findNextElementWith(chapterNode, el => $(el).is('.collapse__content, .collapse__body'));

    return contentNode || titleNode.nextSibling;
}

/**
 * @param {import('cheerio').CheerioAPI} $
 * @param {import('cheerio').Cheerio} article
 * @returns {Promise<Chapter<Element, string>>}
 */
async function getIntroduction($, article) {
    const titleNode = article.find(`> ${TITLE_SELECTOR}`)[0];
    const contentNode = pairTitleContent($, titleNode);

    return {
        titleNode,
        title: $(titleNode).text(),
        content: await htmlToText($, [contentNode], (node, level) =>
            level === 0 && $(node).is('section.chapter'))
    };
}

/**
 * @param {import('cheerio').CheerioAPI} $
 * @param {import('cheerio').Cheerio} article
 * @returns {Promise<Chapter<Element, string>[]>}
 */
async function getChapters($, article) {
    const chapters = article.find('> .chapter');

    return Promise.all([...chapters].map(async function toChapter(chapter) {
        const title = $(chapter).find([
            `> ${TITLE_SELECTOR}`,
            `> .collapse > .collapse__title > ${TITLE_SELECTOR}`
        ].join(','));

        return {
            titleNode: title[0],
            title: title.text(),
            content: null
        };
    }));
}

/**
 * @param {string[]} headings
 * @returns {string|void}
 */
function myMainTitle(headings) {
    return headings.find((title, i, list) => i !== list.length - 1 && (
        title.endsWith('– tutorial') ||
        /advent of code 20\d{2}/i.test(title)
    ));
}

/**
 * @param {import('cheerio').CheerioAPI}$
 * @param {import('cheerio').Cheerio} article
 * @returns {Promise<[intro: Chapter<Element, string>, chapters: Chapter<Element, string>[]]>}
 */
async function extractChapters($, article) {
    return await Promise.all([
        getIntroduction($, article),
        getChapters($, article)
    ]);
}

/**
 * @param {import('cheerio').default} $
 * @param {string} url
 * @param {Object.<key, *>} data
 */
async function docs($, url, data) {
    /** @type {import('cheerio').Cheerio} */
    const $body = $('body[data-template]');
    const isArtile = $body.attr('data-template') === 'article';

    if (!isArtile) {
        console.log(`skip: /${url} not support for landing layouts`);
        return [];
    }

    /** @type {import('cheerio').Cheerio} */
    const $article = $('article.article');
    const pageUrl = new URL($('link[rel="canonical"]').attr('href'));

    dropUiElements($article);
    dropUselessSections($article);
    replaceMedia($article, pageUrl.toString());

    const breadcrumbs = getBreadcrumbs($body);
    const [pageIntro, chaptersTopLevel] = await extractChapters($, $article);

    const chapters = await Promise.all(
        chaptersTopLevel.map(
            /** @returns {Promise<Chapter<Element>[]>} */
            async function toChapter({ title, titleNode }) {
                /** @type {import('cheerio').Cheerio} */
                const $chapterNode = $(titleNode.parentNode);
                const [chapterIntro, chaptersSubLevel] = await extractChapters($, $chapterNode);

                const subChapters = await Promise.all(
                    chaptersSubLevel.map(
                        async function toSubChapter({ title: subTitle, titleNode: subTitleNode }) {
                            const subContentNode = pairTitleContent($, subTitleNode);
                            return {
                                titleNode: subTitleNode,
                                title: title ? [title, subTitle] : subTitle,
                                content: await htmlToText($, [subContentNode])
                            };
                        }
                    )
                );

                return [chapterIntro].concat(...subChapters);
            }
        )
    );

    /** @type {Chapter<Element>[]} */
    const subArticles = [pageIntro].concat(...chapters);

    return Promise.all(subArticles.map(async function toRecord({ title, titleNode, content }) {
        const $titleNode = $(titleNode);
        const id = $titleNode.attr('id');
        const finalUrl = `/${url}#${id}`;

        const pageTitles = [pageIntro.title].concat(title);
        const headings = [...breadcrumbs, ...pageTitles];

        let mainTitle = myMainTitle(headings);
        let pageTitle = pageTitles.pop();

        if (!mainTitle) {
            // random length, formally depends from UI
            if (pageTitles.join(' ').length < 65) {
                mainTitle = pageIntro.title;
                pageTitle = [].concat(title).join(': ');
            } else {
                mainTitle = pageTitles.pop();
                const top = pageTitles.pop();

                if (top && mainTitle.length > top.length)
                    mainTitle = top;
            }
        }

        return ({
            ...DEFAULT_RECORD,
            ...data,

            objectID: finalUrl,
            pageType: 'docs',
            url: new URL(finalUrl, pageUrl).toString(),
            parent: '/' + url,

            headings: headings.reverse().join(' | '),
            mainTitle,
            pageTitle,
            content
        });
    }));
}

export const Page_Documentation = docs;
