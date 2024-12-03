import { basename, dirname, join } from 'node:path';
import { CheerioAPI } from 'cheerio';
import { Element } from 'domhandler';
import { getType } from '../lib/files/type.js';
import { DIST_FOLDER } from '../lib/files/index.js';
import { isHiddenProved, Result } from './lib.js';
import { replaceNode } from '../lib/html.js';

function sendEvent(...args: Parameters<typeof process.send>) {
    process.send(...args);
}

function sendWarning() {
    console.error('process.send is not defined');
}

const send = process.send ? sendEvent : sendWarning;

const HOME_HTML_CONTENT = '' +
    '<section class = "panel__content" ><div class = "container"><article class="article">' +
    '<h1 id = "home.xml">Kotlin Docs</h1>' +
    '</article><div id="disqus_thread"></div ></div></section>';


function buildAnchor(filename: string, hash: string) {
    let result = '#' + filename.replace(/\.html$/, '.md');
    if (hash) result += '-' + hash.substring(1);
    return result;
}

async function fixSectionHtml($: CheerioAPI, node: Element, relativePath: string) {
    const $node = $(node);

    $node.find('.last-modified, .navigation-links._bottom').remove();
    $node.find('img[data-gif-src]').each(function(_i, img) {
        img.attribs.src = img.attribs['data-gif-src'];
    });

    replaceNode($node, '.code-collapse', function($node, _attrs, content) {
        return `<div class="code-block" data-lang="${$node.attr('data-lang')}">${content}</div>`;
    });

    replaceNode($node, 'object[data]', function($node, attrs, content) {
        const textUrl = $node.attr('data');
        try {
            const { hostname, pathname, searchParams } = new URL(textUrl, 'https://kotlinlang.org/');
            if (hostname.endsWith('youtube.com') || hostname.endsWith('youtu.be')) {
                let id = '';
                // https://www.youtube.com/watch?v=...&feature=...
                if (pathname === '/watch') id = searchParams.get('v');
                // http://www.youtube.com/v/...?blabalab
                else if (pathname.startsWith('/v/')) id = pathname.substring(3);
                // http://www.youtube.com/embed/...?blabla
                else if (pathname.startsWith('/embed/')) id = pathname.substring(6);

                if (id)
                    return `<figure class="video"><img src="https://img.youtube.com/vi/${id}/maxresdefault.jpg" width="560"></figure>` +
                        `<p><a href="https://youtube.com/v/${id}">Watch video online.</a></p>`;
            }
        } catch (e) {
            // skip content
        }

        return `<object ${attrs}>${content}</object>`;
    });

    $node.find('figure:not([title]) img[title]').each(function(_i, img) {
        $(img).closest('figure').attr('title', img.attribs.title);
    });

    $node.find('.code-block').each(function(_i, node) {
        let child = node.firstChild;
        while (child) {
            if (child.type === 'text') {
                child.data = child.data.replace(/^[\n\s]+/g, '').trim();
                if (!child.data) child = child.nextSibling;
                else child = null;
            }
        }
    });

    $node.find('[id]:not(h1)').each(function(_i, node) {
        const article = $(node).closest('.article');
        const h1Id = article.find('h1[id$=".md"]').attr('id');
        if (h1Id && article.length === 1) node.attribs.id = h1Id + '-' + node.attribs.id;
    });
    $node.find('a[href]').each(function(_i, node) {
        let anchor = '';

        const href = node.attribs.href;
        const url = new URL(href, 'https://kotlinlang.org/docs/');

        if (href[0] === '#') anchor = buildAnchor(basename(relativePath), href);
        else if (url.hostname === 'kotlinlang.org' && dirname(url.pathname) === '/docs') {
            const filename = basename(url.pathname);
            if (filename.endsWith('.html')) anchor = buildAnchor(filename, url.hash);
        }

        if (anchor) {
            node.attribs.href = anchor;
            node.attribs['data-origin-href'] = href;
        }
    });

    return $.html(node)
        // sample drop
        .replace(/\/\/sampleStart\n/g, '')
        .replace(/\n\/\/sampleEnd/g, '');
}

async function onMessage(relativePath: string) {
    let html: string = null;

    const path = join(DIST_FOLDER, relativePath);
    let [type, $] = await getType(relativePath, path);

    if (isHiddenProved(relativePath, type))
        type = 'Page_Documentation';

    if (type === 'Page_Documentation') {
        const sections = $('section.panel__content');

        if (relativePath === 'docs/home.html') {
            html = HOME_HTML_CONTENT;
        } else if (sections.length > 0) {
            html = '';
            for (const node of sections) {
                html += await fixSectionHtml($, node, relativePath);
            }
        }
    }

    const data: Result = {
        id: relativePath,
        html: html || ''
    };

    send({ event: 'result', data });
}

process.on('message', onMessage);
send({ event: 'inited' });
