import React, { type ReactNode } from 'react';
import { useTextStyles } from '@rescui/typography';
import type { RichText } from '../../utils/cms/content';

export function RichTextView({ text }: { text: RichText }) {
    const textCn = useTextStyles();

    return (
        <>
            {text.map((segment, index) => {
                let content: ReactNode = segment.text;

                if (segment.code) content = <code className="rs-code">{content}</code>;
                if (segment.color) {
                    const color = segment.color.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                    content = <span className={`nw-color-${color}`}>{content}</span>;
                }
                if (segment.italic) content = <em>{content}</em>;
                if (segment.bold) content = <strong>{content}</strong>;

                if (segment.href) {
                    const external = !segment.href.startsWith('/') && !segment.href.startsWith('#');
                    content = (
                        <a
                            className={textCn('rs-link', { external })}
                            href={segment.href}
                            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                        >
                            {content}
                        </a>
                    );
                }

                return <span key={index}>{content}</span>;
            })}
        </>
    );
}
