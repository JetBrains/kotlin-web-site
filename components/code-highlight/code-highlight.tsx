import React, { FC } from 'react';
import { createHighlighter } from 'shiki';

import styles from './code-hightlight.module.css';
import cn from 'classnames';
// @ts-ignore
import dracula from 'shiki/themes/dracula';

interface CodeHighlightProps {
    code: string;
    className?: string;
    language?: string;
}

const customDracula = {
    ...dracula,
    bg: '#282a36',
    tokenColors: [
        ...(dracula.tokenColors || []),
        {
            name: 'Custom: White Classes',
            scope: ['entity.name.function', 'entity.name.type.class'],
            settings: {
                foreground: '#FFFFFF',
            },
        },
        {
            name: 'Custom: Yellow Annotations',
            scope: ['entity.name.type'],
            settings: {
                foreground: '#E88D39',
                fontStyle: '',
            },
        },
        {
            name: 'Custom: Blue Keywords',
            scope: [
                'keyword',
                'storage.type',
                'storage.modifier',
                'constant.language',
                'variable.language',
                'keyword.control'
            ],
            settings: {
                foreground: '#789DFA',
            },
        },
        {
            name: 'Custom: string interpolation',
            scope: ['string.template'],
            settings: {
                foreground: '#C64CD3',
            },
        },
        {
            name: 'Custom: string',
            scope: ['string', 'string.quoted'],
            settings: {
                foreground: '#1DCE19',
            },
        },
    ],
};



export const CodeHighlight: FC<CodeHighlightProps> = ({ code, className = '', language = 'kotlin' }) => {
    const [highlightedCode, setHighlightedCode] = React.useState<string>('');

    React.useEffect(() => {
        const highlight = async () => {
            const highlighter = await createHighlighter({
                langs: ['kotlin'],
                themes: [customDracula],
            });

            const html = highlighter.codeToHtml(code, {
                theme: customDracula.name,
                lang: language,
            });

            setHighlightedCode(html);
        };

        highlight();
    }, [code]);

    return <div className={cn(styles.codeHighlight, className)} dangerouslySetInnerHTML={{ __html: highlightedCode }} />;
};

