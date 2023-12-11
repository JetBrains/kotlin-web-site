import React, { FC, ReactNode, useState, useImperativeHandle, forwardRef } from 'react';
import dynamic from 'next/dynamic';

import styles from './code-block.module.css';

const KotlinPlayground = dynamic<any>(() => import('react-kotlin-playground').then(), {
    loading: () => null,
    ssr: false,
});

interface Props {
    children: ReactNode;
    ref: any;
    targetPlatform?: string;
}

export const CodeBlock: FC<Props> = forwardRef(({ children, targetPlatform }, ref) => {
    const [codeBlockInstance, setCodeBlockInstance] = useState(null);

    const handleGetInstance = (instance) => {
        setCodeBlockInstance(instance);
    };

    useImperativeHandle(ref, () => ({
        runInstance() {
            codeBlockInstance?.execute();
        },
        scrollResultsToView() {
            if (codeBlockInstance?.nodes?.length) {
                const outputWrapper = codeBlockInstance.nodes[0].querySelector('.output-wrapper');
                if (typeof window !== 'undefined' && outputWrapper.getBoundingClientRect().bottom > window.innerHeight) {
                    outputWrapper.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end',
                        inline: 'nearest'
                    });
                }
            }
        }
    }));

    return (
        <>
            <pre className={styles.code}>{children}</pre>
            <KotlinPlayground
                theme={'darcula'}
                autoIndent={false}
                getInstance={handleGetInstance}
                {...(targetPlatform && { targetPlatform })}
                className={styles.codeBlockWrapper}
            >
                {children}
            </KotlinPlayground>
        </>
    );
});

CodeBlock.displayName = 'CodeBlock';
