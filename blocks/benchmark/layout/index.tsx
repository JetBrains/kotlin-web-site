import React from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { GitHubIcon } from '@rescui/icons';

import { LandingLayout } from '@/components/landing-layout/landing-layout';

import styles from './layout.module.css';
import { BENCHMARK_TOP_MENU_ITEMS, GITHUB_URL, KOTLIN_BENCHMARK_TITLE, KOTLIN_BENCHMARK_URL } from '../constants';

interface BenchmarkLayoutProps {
    title: string;
    description: string;
    dataTestId: string;
    currentUrl: string;
    activeTopMenuUrl?: string;
    className?: string;
    children: React.ReactNode;
}

/** The shell shared by every benchmark page: the secondary navigation and the gradient backdrop. */
export function BenchmarkLayout({
    title,
    description,
    dataTestId,
    currentUrl,
    activeTopMenuUrl,
    className,
    children,
}: BenchmarkLayoutProps) {
    return (
        <LandingLayout
            dataTestId={dataTestId}
            title={title}
            description={description}
            ogImageName={'benchmark.jpg'}
            currentTitle={KOTLIN_BENCHMARK_TITLE}
            currentUrl={currentUrl}
            activeTopMenuUrl={activeTopMenuUrl}
            topMenuTitle={KOTLIN_BENCHMARK_TITLE}
            topMenuHomeUrl={KOTLIN_BENCHMARK_URL}
            topMenuItems={BENCHMARK_TOP_MENU_ITEMS}
            topMenuButton={
                <Button icon={<GitHubIcon />} href={GITHUB_URL} target="_blank" rel="noopener">
                    GitHub repo
                </Button>
            }
        >
            <div className={cn(styles.wrapper, className)}>{children}</div>
        </LandingLayout>
    );
}
