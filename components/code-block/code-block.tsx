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
}

export const CodeBlock: FC<Props> = forwardRef(({ children }, ref) => {
    const [codeBlockInstance, setCodeBlockInstance] = useState(null);

    const handleGetInstance = (instance) => {
        setCodeBlockInstance(instance);
    };

    useImperativeHandle(ref, () => ({
        runInstance() {
            codeBlockInstance?.execute();
        },
    }));

    return (
        <>
            <pre className={styles.code}>{children}</pre>
            <KotlinPlayground theme={'darcula'} autoIndent={false} getInstance={handleGetInstance}>
                {children}
            </KotlinPlayground>
        </>
    );
});

CodeBlock.displayName = "CodeBlock";