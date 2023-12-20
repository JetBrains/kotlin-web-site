import React, {
    FC,
    ReactNode,
    useState,
    useImperativeHandle,
    forwardRef,
    useEffect,
    createRef,
} from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';

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

declare global {
  interface Window {
    dataLayer?: any;
  }
}

function trackEvent(event) {
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'GAEvent',
            ...event,
        });
    }
}

export const CodeBlock: FC<Props> = forwardRef(({ children, targetPlatform }, ref) => {
    const [codeBlockInstance, setCodeBlockInstance] = useState(null);
    const [editorFocus, setEditorFocus] = useState<boolean>(false);
    const [isCodeSampleEdited, setIsCodeSampleEdited] = useState<boolean>(false);
    const editButtonRef = createRef<any>();

    const handleGetInstance = (instance) => {
        setCodeBlockInstance(instance);
    };

    useImperativeHandle(ref, () => ({
        runInstance() {
            const event = {
                eventCategory: 'kotlin-playground',
                eventAction: 'Playground Run',
                eventLabel: !isCodeSampleEdited ? 'unchanged' : 'changed',
            };

            trackEvent(event);

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
    };

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

            cmInstance.on('change', (codemirror, event) => {
                setIsCodeSampleEdited(true);
            })
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
                <ThemeProvider theme={'light'}>
                    <Button
                        className={styles.editButton}
                        mode={'rock'}
                        onClick={handleEdit}
                        ref={editButtonRef}
                        size={'l'}
                    >
                        Edit code example
                    </Button>
                </ThemeProvider>
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
