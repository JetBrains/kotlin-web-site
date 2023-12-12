import React, {FC, ReactNode, useState, useImperativeHandle, forwardRef, useEffect, useCallback, createRef} from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@rescui/button';

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
    const [editorFocus, setEditorFocus] = useState<boolean>(false);
    const editButtonRef = createRef<any>();

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
                if (
                    typeof window !== 'undefined' &&
                    outputWrapper.getBoundingClientRect().bottom > window.innerHeight
                ) {
                    outputWrapper.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end',
                        inline: 'nearest',
                    });
                }
            }
        },
    }));

    const handleEdit = () => {
        codeBlockInstance?.codemirror.focus();
    };

    const handleEditorFocus = () => {
        setEditorFocus(true);
    };

    const handleEditorBlur = () => {
        setEditorFocus(false);
    };

    const escHandler = (event) => {
        if (event.keyCode === 27) {
            if (editorFocus && editButtonRef.current) {
                editButtonRef.current.focus();
            }
        }
    }

    useEffect(() => {
        const cmInstance = codeBlockInstance?.codemirror;

        if (cmInstance) {
            cmInstance.setOption('tabindex', '-1');

            cmInstance.on('focus', (codemirror, event) => {
                handleEditorFocus();
            });

            cmInstance.on('blur', (codemirror, event) => {
                handleEditorBlur();
            });
        }
    }, [codeBlockInstance]);

    useEffect(() => {
        if (typeof document !== `undefined`) {
            document.addEventListener('keydown', escHandler);
            return () => {
                document.removeEventListener('keydown', escHandler);
            };
        }
    }, [escHandler]);

    return (
        <div className={styles.codeBlockContainer} tabIndex={-1}>
            <pre className={styles.code}>{children}</pre>
            <div className={styles.buttonWrapper}>
                <Button className={styles.editButton} mode={'outline'} onClick={handleEdit} ref={editButtonRef}>
                    Edit
                </Button>
            </div>
            <div>
                <KotlinPlayground
                    theme={'darcula'}
                    autoIndent={false}
                    getInstance={handleGetInstance}
                    {...(targetPlatform && { targetPlatform })}
                    className={styles.codeBlockWrapper}
                >
                    {children}
                </KotlinPlayground>
            </div>
        </div>
    );
});

CodeBlock.displayName = 'CodeBlock';
