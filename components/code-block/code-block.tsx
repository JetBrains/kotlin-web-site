import React, { FC, ReactNode, createContext, useState } from 'react';
import dynamic from 'next/dynamic';

import styles from './code-block.module.css';

const KotlinPlayground = dynamic<any>(() => import('react-kotlin-playground').then(), {
    loading: () => null,
    ssr: false,
});

interface Props {
    children: ReactNode;
}

export const CodeBlockContext = createContext(null);

export const CodeBlock: FC<Props> = ({ children }) => {
    const [codeBlockInstance, setCodeBlockInstance] = useState(null);

    const handleGetInstance = (instance) => {
        setCodeBlockInstance(instance);
    };

    return (
        <CodeBlockContext.Provider value={codeBlockInstance}>
            <pre className={styles.code}>{children}</pre>

            <KotlinPlayground theme={'darcula'} autoIndent={false} getInstance={handleGetInstance}>
                {children}
            </KotlinPlayground>
        </CodeBlockContext.Provider>
    );
};
