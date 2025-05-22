import React from 'react';

import cn from 'classnames';

import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';
import { useTextStyles } from '@rescui/typography';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints';
import { BlockScheme } from './block-scheme';

import styles from './kotlin-plus-ai.module.css';

function HighlightedList() {
    const textCn = useTextStyles();
    const textClass = cn(textCn('rs-text-2', { hardness: 'hard' }), styles.highlightItem);

    return (
        <ul className={styles.highlight}>
            <li className={textClass}>Strong support across JetBrains AI tools like AI Assistant and Junie</li>
            <li className={textClass}>Robust functionality for building AI-powered apps on the JVM</li>
            <li className={textClass}>Native integration with tools like Spring AI and LangChain4j</li>
            <li className={textClass}>Open data and benchmarks for better code generation</li>
        </ul>
    );
}

function KotlinPlusAI() {
    const textCn = useTextStyles();
    const textClass = cn(textCn('rs-text-2', { hardness: 'hard' }), styles.para);
    const introClass = cn(textClass, styles.intro);
    const classTitle = cn(textCn('rs-h2'), styles.title, styles.titleWide);
    const size = useMS() ? 'm' : 'l';

    return (
        <ThemeProvider theme="dark">
            <div className={styles.wrapper} id="kotlin-plus-ai">
                <h2 className={cn(classTitle, styles.introTitle)}>Kotlin + AI</h2>
                <p className={introClass}>JetBrains is investing in AI models tailored for Kotlin, providing open data,
                    benchmarks, and AI-native tooling integrated into your workflow.</p>
                <p className={introClass}>At the same time, Kotlin makes it easy to build your own AI-powered features
                    with seamless backend integrations and a growing ecosystem.</p>

                <div className={styles.getAI}>
                    <h3 className={cn(textCn('rs-h3'), styles.title)}>What you get with Kotlin + AI</h3>
                    <HighlightedList />
                </div>

                <div className={styles.buttons}>
                    <Button mode="rock" size={size} href="https://www.jetbrains.com/ai/">Learn about JetBrains AI</Button>
                    <Button mode="outline" size={size}
                            href="/docs/kotlin-ai-apps-development-overview.html">Build AI apps with Kotlin</Button>
                </div>

                <div className={styles.buildAgents}>
                    <div className={styles.buildAgentsContent}>
                        <h3 className={classTitle}>Build your own AI agents with&nbsp;Koog</h3>
                        <p className={textClass}>Koog is JetBrains’ new Kotlin-native framework for creating powerful AI
                            agents that run locally, interact with tools, and automate complex tasks. Whether you’re
                            developing a simple chat assistant or an advanced multi-step workflow, Koog gives you full
                            control with clean Kotlin code – no external services are required. Build, extend, and
                            experiment with AI agents entirely in Kotlin.</p>
                        <Button mode="rock" size={size} className={styles.getStarted} href="https://docs.koog.ai/">Get
                            started</Button>
                    </div>
                    <BlockScheme className={styles.buildAgentsScheme} />
                </div>
            </div>
        </ThemeProvider>
    );
}

export function KotlinPlusAiInfo() {
    return (
        <ThemeProvider theme="dark">
            <KotlinPlusAI />
        </ThemeProvider>
    );
}
