import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import Head from 'next/head';
import { Button } from '@rescui/button';
import { ExternalOutlineIcon, PlayIcon } from '@rescui/icons';
import { createTextCn } from '@rescui/typography';
import { generateCrosslink } from 'kotlin-playground/dist/crosslink';
import styles from './playground-block.module.css';

import codeSample from './code-sample.md';

const TARGET_PLATFORM = 'compose-wasm';

const PLAYGROUND_ATTRIBUTES: Record<string, string> = {
    theme: 'darcula',
    'data-target-platform': TARGET_PLATFORM,
    'data-crosslink': 'disabled',
    'folded-button': 'false',
    'auto-indent': 'false'
};

export const PlaygroundBlock = () => {
    const textCn = createTextCn('dark');
    const codeRef = useRef<HTMLElement>(null);
    const [instance, setInstance] = useState(null);

    // The playground touches `window` on import, so it's loaded on the client only
    useEffect(() => {
        let isUnmounted = false;

        import('kotlin-playground').then(({ default: playground }) => {
            if (!isUnmounted && codeRef.current) playground(codeRef.current, { getInstance: setInstance });
        });

        return () => {
            isUnmounted = true;
        };
    }, []);

    const handleRun = () => {
        instance?.execute();
    };

    // Opens the code as currently edited, not the original sample
    const handleOpenInPlayground = () => {
        const code = instance?.getCode() ?? codeSample;
        window.open(generateCrosslink(code, { targetPlatform: TARGET_PLATFORM }), '_blank', 'noopener');
    };

    return (
        <section
            className={cn(styles.playground, 'ktl-layout', 'ktl-layout--center')}
            data-testid="playground-block"
        >
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" rel="stylesheet" />
            </Head>

            <div className={styles.header}>
                <h2 className={cn(textCn('rs-h1'), styles.title)} data-testid="playground-block-title">
                    Try Compose Multiplatform
                </h2>
                <div className={styles.controls}>
                    <Button
                        mode="outline"
                        size="m"
                        icon={<ExternalOutlineIcon />}
                        aria-label="Open in Playground"
                        onClick={handleOpenInPlayground}
                    />
                    <Button
                        className={styles.runButton}
                        mode="classic"
                        size="m"
                        icon={<PlayIcon />}
                        onClick={handleRun}
                        disabled={!instance}
                    >
                        Run
                    </Button>
                </div>
            </div>

            <div className={styles.editor} data-testid="playground-block-editor">
                <code ref={codeRef} {...PLAYGROUND_ATTRIBUTES}>
                    {codeSample}
                </code>
            </div>
        </section>
    );
};
