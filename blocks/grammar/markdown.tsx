import { createTextCn } from '@rescui/typography';
import { Markdown, MarkdownProps } from '../../utils/mdToHtml';

import styles from './grammar.module.css';
import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import cn from 'classnames';

const textCn = createTextCn('light');

// Legacy grammar documentation constants for URL rebasing
const OLD_GRAMMAR_HOST = 'https://kotlinlang.org' as const;
const OLD_GRAMMAR_PATH = '/docs/reference/grammar.html' as const;

/**
 * Converts relative URLs to absolute URLs or hash-only references.
 * Handles migration from old Kotlin grammar documentation paths.
 */
function rebaseRelativeUrl(href: string) {
    let url = null;

    try {
        // If href is already a valid absolute URL, return it as-is
        return new URL(href).toString();
    } catch (e) {
        // Not a valid absolute URL, treat as relative path
    }

    // Construct absolute URL using old grammar documentation as base
    url = new URL(href, `${OLD_GRAMMAR_HOST}${OLD_GRAMMAR_PATH}`);

    // If the path is the grammar page itself, return only the hash (anchor)
    if (url.pathname === OLD_GRAMMAR_PATH) return url.hash;

    // Return URL with old host stripped to make it relative to current domain
    return url.toString().replace(OLD_GRAMMAR_HOST, '');
}

/**
 * Default markdown component overrides for grammar documentation.
 * Applies consistent typography styles to all markdown elements.
 */
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

/**
 * Custom link component that rebases URLs and applies consistent styling.
 * Used to override default anchor tag rendering in markdown.
 */
export function LinkComponent(props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
    const { href, ...rest } = props;
    return <a
        {...rest} href={rebaseRelativeUrl(href)}
        className={cn(textCn('rs-link'), styles.link, props.className)}
    />;
}

/**
 * Specialized Markdown component for grammar documentation.
 * Processes extended markdown syntax (IAL attributes) and applies grammar-specific styling.
 */
export function GrammarMarkdown({ children, options, ...props }: MarkdownProps) {
    if (typeof children === 'string') children = extendedMarkdown(children);

    const opts = { ...DEFAULT_OPTIONS, ...options };
    return <Markdown {...props} options={opts}>{children as MarkdownProps['children']}</Markdown>;
}

/**
 * Parsed Inline Attribute List (IAL) representation.
 * IAL syntax allows adding attributes to markdown elements: {: .class #id attr="value" }
 */
interface ParsedIAL {
    className?: string;
    id?: string;

    /** Additional HTML attributes */
    [key: string]: string | undefined;
}

/** Converts parsed IAL object to HTML attribute string. */
function attrsToString(attrs: ParsedIAL): string {
    return Object.keys(attrs).map(key => `${key}="${attrs[key]}"`).join(' ');
}

/**
 * Processes extended markdown syntax with IAL (Inline Attribute Lists).
 * Converts: [text](url){: .class #id attr="value"} → <a href="url" class="class" id="id" attr="value">text</a>
 */
export function extendedMarkdown(content: string): string {
    return content.replaceAll(/\[([^\]]+)\]\(([^)]+)\)\{:([^}]+)\}/g, function(match, linkText, linkUrl, ialString) {
        return `<a href="${linkUrl}" ${attrsToString(parseIAL(ialString))}>${linkText}</a>`;
    });
}

/**
 * Parses IAL (Inline Attribute List) string into structured object.
 * Supported syntax:
 * - Classes: .className
 * - ID: #elementId
 * - Attributes: key="value" or key='value'
 */
export function parseIAL(ialString: string): ParsedIAL {
    const result: ParsedIAL = {};
    // Remove IAL wrapper: {: ... } or just leading/trailing whitespace
    const content = ialString.replace(/^\{:\s*/, '').replace(/\s*\}$/, '');
    const classes: string[] = [];

    // Extract all class names (.className)
    content.replace(/\.([a-zA-Z0-9_-]+)/g, (_, className) => {
        classes.push(className);
        return '';
    });

    if (classes.length) result.className = classes.join(' ');

    // Extract ID (#elementId)
    const idMatch = content.match(/#([a-zA-Z0-9_-]+)/);
    if (idMatch) result.id = idMatch[1];

    // Extract key="value" or key='value' attributes
    const attrRegex = /([a-zA-Z_-]+)=["']([^"']+)["']/g;

    let match;

    while ((match = attrRegex.exec(content)) !== null) {
        result[match[1]] = match[2];
    }

    return result;
}
