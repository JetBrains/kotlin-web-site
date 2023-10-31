import React, { FC, useState, useCallback, createRef } from 'react';
import cn from 'classnames';

import { useTextStyles, createTextCn } from '@rescui/typography';
import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';
import { CodeIcon, PlayIcon, DownIcon } from '@rescui/icons';
import NavItem from '@jetbrains/kotlin-web-site-ui/out/components/nav-item/';

import { SidebarMenu, SidebarMenuHeader } from '@jetbrains/kotlin-web-site-ui/out/components/sidebar-menu/';

import '@jetbrains/kotlin-web-site-ui/out/components/layout';

import { CodeBlock } from '../../../components/code-block/code-block';

import styles from './why-kotlin.module.css';
import './playground.css';

import simpleExample from './code-examples/simple.md';
import asyncExample from './code-examples/asynchronous.md';
import oopExample from './code-examples/object-oriented.md';
import functionalExample from './code-examples/functional.md';
import testsExample from './code-examples/ideal-for-tests.md';

import { generateCrosslink } from 'kotlin-playground/dist/crosslink';

interface Props {}

const ContentSwitcher = ({ index, children }) => {
    return children[index];
};

export const WhyKotlin: FC<Props> = ({}) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [mobileMenuVisible, setMobileMenuVisible] = useState<boolean>(false);

    const textCn = useTextStyles();
    const darkTextCn = createTextCn('dark');

    const handleMobileMenuToggle = useCallback(() => {
        setMobileMenuVisible(!mobileMenuVisible);
    }, []);

    const handleMobileMenuItemClick = useCallback((index) => {
        setActiveIndex(index);
        setMobileMenuVisible(false);
    }, []);

    const codeExamplesList = [
        { children: 'Simple', codeExample: simpleExample },
        { children: 'Asynchronous', codeExample: asyncExample },
        { children: 'Object-oriented', codeExample: oopExample },
        { children: 'Functional', codeExample: functionalExample },
        { children: 'Ideal for tests', codeExample: testsExample },
    ];

    const codeInstanceRef = createRef<any>();

    const handleRunButton = useCallback(() => {
        codeInstanceRef?.current?.runInstance();
    }, [codeInstanceRef]);

    const handleOpenInPlaygroundButton = () => {
        const link = generateCrosslink(codeExamplesList[activeIndex].codeExample);
        if (typeof window !== 'undefined') {
            window.open(link, '_blank');
        }
    };

    return (
        <ThemeProvider theme={'dark'}>
            <section className={styles.whyKotlin}>
                <div className={cn('ktl-layout', 'ktl-layout--center')}>
                    <div className={cn(darkTextCn('rs-h1'), styles.sectionTitle)}>Why Kotlin</div>

                    <div className={styles.codeExamples}>
                        <div className={styles.navigationBar}>
                            <div className={styles.mobileMenuButton}>
                                <NavItem icon={<DownIcon />} iconPosition={'right'} onClick={handleMobileMenuToggle}>
                                    {codeExamplesList[activeIndex].children}
                                </NavItem>

                                <SidebarMenu
                                    before={
                                        <SidebarMenuHeader>
                                            <div className={darkTextCn('rs-text-2', { hardness: 'hard' })}>
                                                Code examples
                                            </div>
                                        </SidebarMenuHeader>
                                    }
                                    isOpen={mobileMenuVisible}
                                    items={codeExamplesList}
                                    activeIndex={activeIndex}
                                    onClose={() => setMobileMenuVisible(false)}
                                    onItemClick={(item, i) => handleMobileMenuItemClick(i)}
                                />
                            </div>

                            <div className={styles.tabList}>
                                {codeExamplesList.map((item, index) => (
                                    <NavItem
                                        key={index}
                                        onClick={() => setActiveIndex(index)}
                                        active={activeIndex === index}
                                    >
                                        {item.children}
                                    </NavItem>
                                ))}
                            </div>

                            <div className={styles.controlButtons}>
                                <div className={styles.openInPlaygoundButton}>
                                    <NavItem onClick={handleOpenInPlaygroundButton} icon={<CodeIcon />}>
                                        Open in Playground
                                    </NavItem>
                                </div>

                                <NavItem icon={<PlayIcon />} onClick={handleRunButton}>
                                    Run
                                </NavItem>
                            </div>
                        </div>

                        <div className="tab-content kotlin-code-examples-section">
                            <ContentSwitcher index={activeIndex}>
                                {codeExamplesList.map((item, index) => (
                                    <div className={styles.tab} key={index} tabIndex={-1}>
                                        <CodeBlock ref={codeInstanceRef}>{item.codeExample}</CodeBlock>
                                    </div>
                                ))}
                            </ContentSwitcher>
                        </div>
                    </div>

                    <Button
                        mode={'outline'}
                        size={'l'}
                        className={styles.getStartedButton}
                        href={'docs/getting-started.html'}
                        tabIndex={1}
                    >
                        Get started
                    </Button>
                </div>
            </section>
        </ThemeProvider>
    );
};
