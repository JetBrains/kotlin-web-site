import { createTextCn } from '@rescui/typography';
import { Markdown, MarkdownProps } from '../../utils/mdToHtml';

import styles from './grammar.module.css';
import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import cn from 'classnames';

const textCn = createTextCn('light');

const OLD_GRAMMAR_HOST = 'https://kotlinlang.org' as const;
const OLD_GRAMMAR_PATH = '/docs/reference/grammar.html' as const;

function rebaseRelativeUrl(href: string) {
    let url = null;

    try {
        return new URL(href).toString();
    } catch (e) {
        // It's not a valid URL, so it's probably a relative path.
    }

    url = new URL(href, `${OLD_GRAMMAR_HOST}${OLD_GRAMMAR_PATH}`);

    if (url.pathname === OLD_GRAMMAR_PATH) return url.hash;

    return url.toString().replace(OLD_GRAMMAR_HOST, '');
}

const DEFAULT_OPTIONS = {
    overrides: {
        h2: {
            component: (props: any) => {
                return <h2 {...props} className={textCn('rs-h2')} />;
            }
        },
        h3: {
            component: (props: any) => {
                return <h3 {...props} className={textCn('rs-h3')} />;
            }
        },
        h4: {
            component: (props: any) => {
                return <h4 {...props} className={textCn('rs-h4')} />;
            }
        },
        h5: {
            component: (props: any) => {
                return <h5 {...props} className={textCn('rs-h4')} />;
            }
        },
        code: {
            component: (props: any) => {
                return <code {...props} className={textCn('rs-code')} />;
            }
        },
        ul: {
            component: (props: any) => {
                return <ul {...props} className={`${textCn('rs-ul')}`} />;
            }
        },
        ol: {
            component: (props: any) => {
                return <ol {...props} className={`${textCn('rs-ol')}`} />;
            }
        },
        a: {
            component: LinkComponent
        }
    }
};

export function LinkComponent(props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
    const { href, ...rest } = props;
    return <a
        {...rest} href={rebaseRelativeUrl(href)}
        className={cn(textCn('rs-link'), styles.link, props.className)}
    />;
}

export function GrammarMarkdown({ children, options, ...props }: MarkdownProps) {
    if (typeof children === 'string') children = extendedMarkdown(children);

    const opts = { ...DEFAULT_OPTIONS, ...options };
    return <Markdown {...props} options={opts}>{children as MarkdownProps['children']}</Markdown>;
}

interface ParsedIAL {
    className?: string;
    id?: string;

    [key: string]: string | undefined;
}

function attrsToString(attrs: ParsedIAL): string {
    return Object.keys(attrs).map(key => `${key}="${attrs[key]}"`).join(' ');
}

export function extendedMarkdown(content: string): string {
    return content.replaceAll(/\[([^\]]+)\]\(([^)]+)\)\{:([^}]+)\}/g, function(match, linkText, linkUrl, ialString) {
        return `<a href="${linkUrl}" ${attrsToString(parseIAL(ialString))}>${linkText}</a>`;
    });
}

export function parseIAL(ialString: string): ParsedIAL {
    const result: ParsedIAL = {};
    const content = ialString.replace(/^\{:\s*/, '').replace(/\s*\}$/, '');
    const classes: string[] = [];

    content.replace(/\.([a-zA-Z0-9_-]+)/g, (_, className) => {
        classes.push(className);
        return '';
    });

    if (classes.length) result.className = classes.join(' ');

    const idMatch = content.match(/#([a-zA-Z0-9_-]+)/);
    if (idMatch) result.id = idMatch[1];

    const attrRegex = /([a-zA-Z_-]+)=["']([^"']+)["']/g;

    let match;

    while ((match = attrRegex.exec(content)) !== null) {
        result[match[1]] = match[2];
    }

    return result;
}
