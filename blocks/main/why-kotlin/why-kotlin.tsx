import React, { FC, useState, useContext } from 'react';
import cn from 'classnames';

import { useTextStyles, createTextCn } from '@rescui/typography';
import { TabList, Tab } from '@rescui/tab-list';
import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';
import { CodeIcon, PlayIcon } from '@rescui/icons';

import '@jetbrains/kotlin-web-site-ui/out/components/layout';

import { CodeBlock } from '../../../components/code-block/code-block';

import styles from './why-kotlin.module.css';
import './playground.css';

import { CodeBlockContext } from '../../../components/code-block/code-block';

import simpleExample from './code-examples/simple.md';
import asyncExample from './code-examples/asynchronous.md';
import oopExample from './code-examples/object-oriented.md';
import functionalExample from './code-examples/functional.md';
import testsExample from './code-examples/ideal-for-tests.md';

interface Props {}

const ContentSwitcher = ({ index, children }) => {
    return children[index];
};

export const WhyKotlin: FC<Props> = ({}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const textCn = useTextStyles();
    const darkTextCn = createTextCn('dark');

    const codeBlockInstance = useContext(CodeBlockContext);

    const handleRunButton = () => {
        codeBlockInstance.execute();
    };

    return (
        <ThemeProvider theme={'dark'}>
            <section className={styles.whyKotlin}>
                <div className={cn('ktl-layout', 'ktl-layout--center')}>
                    <div className={cn(darkTextCn('rs-h1'), styles.sectionTitle)}>Why Kotlin</div>

                    <div className={styles.codeExamples}>
                        <div className={styles.navigationBar}>
                            <div className={styles.mobileMenuButton}>
                                <Button mode={'clear'} size={'m'}>
                                    Mobile button
                                </Button>
                            </div>

                            <TabList
                                value={activeIndex}
                                onChange={(v) => setActiveIndex(v)}
                                mode={'rock'}
                                size={'m'}
                                className={styles.tabList}
                            >
                                <Tab>Simple</Tab>
                                <Tab>Asynchronous</Tab>
                                <Tab>Object-oriented</Tab>
                                <Tab>Functional</Tab>
                                <Tab>Ideal for tests</Tab>
                            </TabList>

                            <div>
                                <Button
                                    mode={'clear'}
                                    size={'m'}
                                    icon={<CodeIcon />}
                                    className={styles.openInPlaygoundButton}
                                >
                                    Open in Playground
                                </Button>
                                <Button mode={'clear'} size={'m'} icon={<PlayIcon />} onClick={handleRunButton}>
                                    Run
                                </Button>
                            </div>
                        </div>

                        <div className="tab-content kotlin-code-examples-section">
                            <ContentSwitcher index={activeIndex}>
                                <div className={styles.tab} key={0}>
                                    <CodeBlock>{simpleExample}</CodeBlock>
                                </div>
                                <div className={styles.tab} key={1}>
                                    <CodeBlock>{asyncExample}</CodeBlock>
                                </div>
                                <div className={styles.tab} key={2}>
                                    <CodeBlock>{oopExample}</CodeBlock>
                                </div>
                                <div className={styles.tab} key={3}>
                                    <CodeBlock>{functionalExample}</CodeBlock>
                                </div>
                                <div className={styles.tab} key={4}>
                                    <CodeBlock>{testsExample}</CodeBlock>
                                </div>
                            </ContentSwitcher>
                        </div>
                    </div>

                    <Button mode={'outline'} size={'l'} className={styles.getStartedButton}>
                        Get started
                    </Button>
                </div>
            </section>
        </ThemeProvider>
    );
};
