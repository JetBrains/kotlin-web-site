import { useRouter } from 'next/router';

import { PageLayout, PageLayoutProps } from './page-layout';

import styles from './layout.module.css';

export function Layout({ children, ...props }: Omit<PageLayoutProps, 'sticky' | 'pathname'>) {
    const { pathname } = useRouter();
    return (
        <PageLayout sticky={true} pathname={pathname} {...props}>
            <div className={styles.wrapper}>
                {children}
            </div>
        </PageLayout>
    );
}
