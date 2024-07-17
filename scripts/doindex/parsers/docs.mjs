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
 * @returns {void}
 */
function dropMedia(article) {
    article.find('.video-player').remove();
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
 * @param {import('cheerio').Cheerio<Element>} article
 */
async function splitOnSubArticles($, article) {
    const [pageIntro, chaptersTop] = await Promise.all([
        getIntroduction($, article),
        getChapters($, article)
    ]);

    const chapters = await Promise.all(chaptersTop.map(async ({ titleNode }) => {
        const chapterNode = $(titleNode.parentNode);

        const [intro, list] = await Promise.all([
            getIntroduction($, chapterNode),
            getChapters($, chapterNode)
        ]);

        return [intro].concat(...await Promise.all(list.map(async chapter => {
            const titleNode = chapter.titleNode;
            const chapterNode = $(titleNode.parentNode);
            const contentNode = chapterNode.is('.collapse__title') ?
                findNextElementWith(chapterNode[0], el =>
                    $(el).is('.collapse__content, .collapse__body')) :
                titleNode.nextSibling;

            return ({
                titleNode,
                title: `${pageIntro.title}: ${chapter.title}`,
                content: await htmlToText($, [contentNode])
            });
        })));
    }));

    return [pageIntro].concat(...chapters);
}

/**
 * @param {import('cheerio').CheerioAPI} $
 * @param {string} url
 */
async function docs($, url, data) {
    const body = $('body[data-template]');
    const isArtile = body.attr('data-template') === 'article';

    if (!isArtile) {
        console.log(`skip: /${url} not support for landing layouts`);
        return [];
    }

    const article = $('article.article');

    dropNextSections(article);
    dropMedia(article);

    const subArticles = await splitOnSubArticles($, article);

    const { protocol, hostname } = new URL($('link[rel="canonical"]').attr('href'));

    const breadcrumbs = getBreadcrumbs(body);

    const records = await Promise.all(subArticles.map(async ({ title, titleNode, content }) => {
        const id = $(titleNode).attr('id');
        const objectID = `/${url}#${id}`;
        return ({
            ...DEFAULT_RECORD,
            ...data,

            objectID,
            url: `${protocol}//${hostname}${objectID}`,
            pageType: 'docs',

            headings: [...breadcrumbs, title].join(' '),
            mainTitle: title,
            pageTitle: title,

            content
        });
    }));

    return records;
}

export const Page_Documentation = docs;
