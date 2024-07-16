import { DEFAULT_RECORD, htmlToText } from '../lib/parse.mjs';
import { findNextElementWith } from '../lib/html.mjs';

function getBreadcrumbs(article) {
    return article.attr('data-breadcrumbs')?.split('///') || [];
}

function dropNextSections(article) {
    article.find([
        '.chapter:has(#what-s-next)', '.chapter:has(#next-step)',
        '.chapter:has(#learn-more)', '.chapter:has(#leave-feedback)'
    ].join(', ')).remove();
}

function dropMedia(article) {
    article.find('.video-player').remove();
}

const TITLE_SELECTOR = '[id]:is(h1, h2, h3, h4)';

async function getIntroduction(doc, article) {
    const titleNode = article.find(`> ${TITLE_SELECTOR}`)[0];

    return {
        titleNode,
        title: doc(titleNode).text(),
        content: await htmlToText(doc, [titleNode.nextSibling], (node, level) =>
            level === 0 && doc(node).is('section.chapter'))
    };
}

function getChapters(doc, article) {
    const chapters = article.find('> .chapter');

    return Promise.all([...chapters].map(async (chapter) => {
        const title = doc(chapter).find([
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

async function splitOnSubArticles(doc, article) {
    const [pageIntro, chaptersTop] = await Promise.all([
        getIntroduction(doc, article),
        getChapters(doc, article)
    ]);

    const chapters = await Promise.all(chaptersTop.map(async ({ titleNode }) => {
        const chapterNode = doc(titleNode.parentNode);

        const [intro, list] = await Promise.all([
            getIntroduction(doc, chapterNode),
            getChapters(doc, chapterNode)
        ]);

        return [intro].concat(...await Promise.all(list.map(async chapter => {
            const titleNode = chapter.titleNode;
            const chapterNode = doc(titleNode.parentNode);
            const contentNode = chapterNode.is('.collapse__title') ?
                findNextElementWith(chapterNode[0], el =>
                    doc(el).is('.collapse__content, .collapse__body')) :
                titleNode.nextSibling;

            return ({
                titleNode,
                title: `${pageIntro.title}: ${chapter.title}`,
                content: await htmlToText(doc, [contentNode])
            });
        })));
    }));

    return [pageIntro].concat(...chapters);
}

async function docs(url, data, doc) {
    const body = doc('body[data-template]');
    const isArtile = body.attr('data-template') === 'article';

    if (!isArtile) {
        console.log(`skip: /${url} not support for landing layouts`);
        return [];
    }

    const article = doc('article.article');

    dropNextSections(article);
    dropMedia(article);

    const subArticles = await splitOnSubArticles(doc, article);

    const { protocol, hostname } = new URL(doc('link[rel="canonical"]').attr('href'));

    const breadcrumbs = getBreadcrumbs(body);

    const records = await Promise.all(subArticles.map(async ({ title, titleNode, content }) => {
        const id = doc(titleNode).attr('id');
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
