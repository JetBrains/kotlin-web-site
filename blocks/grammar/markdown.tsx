import { ReactNode } from 'react';
import { Markdown, MarkdownProps } from '../../utils/mdToHtml';

type Props = { children: string | ReactNode };

export function GrammarMarkdown({ children, ...props }: Props) {
    if (typeof children === 'string') children = extendedMarkdown(children);
    return <Markdown {...props}>{children as MarkdownProps['children']}</Markdown>;
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
