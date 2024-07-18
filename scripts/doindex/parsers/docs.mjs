import { DEFAULT_RECORD, htmlToText } from '../lib/parse.mjs';
import { findNextElementWith } from '../lib/html.mjs';

/** @typedef {import('domhandler').Node} Node */
/** @typedef {import('domhandler').Element} Element */

/**
 * @param {import('cheerio').Cheerio<Element>} article
 * @returns {string[]}
 */
function getBreadcrumbs(article) {
    return article.attr('data-breadcrumbs')?.split('///') || [];
}

/**
 * @param {import('cheerio').Cheerio<Element>} article
 * @returns {void}
 */
function dropNextSections(article) {
    article.find([
        '.chapter:has(#what-s-next)', '.chapter:has(#next-step)',
        '.chapter:has(#learn-more)', '.chapter:has(#leave-feedback)'
    ].join(', ')).remove();
}

/**
 * @param {import('cheerio').Cheerio<Element>} article
 * @param {string} pageUrl
 * @returns {void}
 */
function processMedia(article, pageUrl) {
    const videos = article.find('.video-player');

    for (let i = 0, length = videos.length; i < length; i++) {
        const video = videos.eq(i);
        const url = video.find('object[data]').attr('data');
        video.replaceWith(url ? `&lt;${new URL(url, pageUrl).hostname}&gt;` : '&lt;video&gt;');
    }
}

/**
 * @param {import('cheerio').Cheerio<Element>} article
 * @returns {void}
 */
function dropUiElements(article) {
    article.find('.last-modified').remove();
    article.find('.navigation-links').remove();
    article.find('[class*="inline-icon-"]').remove();
}

const TITLE_SELECTOR = '[id]:is(h1, h2, h3, h4)';

/**
 * @param {import('cheerio').CheerioAPI} $
 * @param {import('cheerio').Cheerio<Element>} article
 */
async function getIntroduction($, article) {
    const titleNode = article.find(`> ${TITLE_SELECTOR}`)[0];

    return {
        titleNode,
        title: $(titleNode).text(),
        content: await htmlToText($, [titleNode.nextSibling], (node, level) =>
            level === 0 && $(node).is('section.chapter'))
    };
}

/**
 * @param {import('cheerio').CheerioAPI} $
 * @param {import('cheerio').Cheerio<Element>} article
 */
function getChapters($, article) {
    const chapters = article.find('> .chapter');

    return Promise.all([...chapters].map(async (chapter) => {
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
 * @param {import('cheerio').CheerioAPI} $
 * @param {string} url
 * @param {Object.<key, *>} data
 */
async function docs($, url, data) {
    const body = $('body[data-template]');
    const isArtile = body.attr('data-template') === 'article';

    if (!isArtile) {
        console.log(`skip: /${url} not support for landing layouts`);
        return [];
    }

    const article = $('article.article');
    const pageUrl = new URL($('link[rel="canonical"]').attr('href'));

    dropUiElements(article);
    dropNextSections(article);
    processMedia(article, pageUrl.toString());

    const breadcrumbs = getBreadcrumbs(body);

    const [pageIntro, chaptersTopLevel] = await Promise.all([
        getIntroduction($, article),
        getChapters($, article)
    ]);

    const chapters = await Promise.all(
        chaptersTopLevel.map(async ({ title, titleNode }) => {
            const chapterNode = $(titleNode.parentNode);

            const [chapterIntro, chaptersSubLevel] = await Promise.all([
                getIntroduction($, chapterNode),
                getChapters($, chapterNode)
            ]);

            const subChapters = [chapterIntro].concat(...await Promise.all(
                chaptersSubLevel.map(async subChapter => {
                    const subTitleNode = subChapter.titleNode;
                    const subChapterNode = $(subTitleNode.parentNode);
                    const subContentNode = subChapterNode.is('.collapse__title') ?
                        findNextElementWith(subChapterNode[0], el =>
                            $(el).is('.collapse__content, .collapse__body')) :
                        subTitleNode.nextSibling;

                    return {
                        titleNode: subTitleNode,
                        title: title ? [title, subChapter.title] : subChapter.title,
                        content: await htmlToText($, [subContentNode])
                    };
                }))
            );

            return subChapters;
        })
    );

    const subArticles = [pageIntro].concat(...chapters);

    return Promise.all(subArticles.map(async ({ title, titleNode, content }) => {
        const id = $(titleNode).attr('id');
        const finalUrl = `/${url}#${id}`;
        return ({
            ...DEFAULT_RECORD,
            ...data,

            objectID: finalUrl,
            pageType: 'docs',
            url: new URL(finalUrl, pageUrl),
            parent: '/' + url,

            headings: breadcrumbs.concat(title).reverse().join(' | '),
            mainTitle: pageIntro.title,
            pageTitle: [].concat(title).join(': '),
            content
        });
    }));
}

export const Page_Documentation = docs;
