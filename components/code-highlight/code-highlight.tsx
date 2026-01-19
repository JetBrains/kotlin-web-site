import React, { FC } from 'react';
import { codeToHtml } from 'shiki';

import styles from './code-hightlight.module.css';
import cn from 'classnames';

interface CodeHighlightProps {
    code: string;
    className?: string;
    language?: string;
}

export const CodeHighlight: FC<CodeHighlightProps> = ({ code, className = '', language = 'kotlin' }) => {
    const [highlightedCode, setHighlightedCode] = React.useState<string>('');

    React.useEffect(() => {
        const highlight = async () => {
            const html = await codeToHtml(code, {
                lang: language,
                theme: 'night-owl',
                colorReplacements: {
                    '#011627': '#19191C',
                },
            });

            setHighlightedCode(html);
        };

        highlight();
    }, [code]);

    return <div className={cn(styles.codeHighlight, className)} dangerouslySetInnerHTML={{ __html: highlightedCode }} />;
};

