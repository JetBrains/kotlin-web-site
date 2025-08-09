import React, { FC } from 'react';
import { codeToHtml } from 'shiki';

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
                theme: 'dracula',
                lang: language,
            });
            setHighlightedCode(html);
        };

        highlight();
    }, [code]);

    return <div className={className} dangerouslySetInnerHTML={{ __html: highlightedCode }} />;
};

