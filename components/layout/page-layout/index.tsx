import { ThemeProvider } from '@rescui/ui-contexts';

import GlobalHeader from '@jetbrains/kotlin-web-site-ui/out/components/header';
import GlobalFooter from '@jetbrains/kotlin-web-site-ui/out/components/footer';

import { PageMetadata, PageMetadataProps } from '../../page-metadata';

import searchConfig from '../../../search-config.json';
import releasesData from '../../../data/releases.yml';

import styles from './page-layout.module.css';

export type PageLayoutProps = PageMetadataProps & {
    pathname: string,
    sticky?: boolean
};

export function PageLayout({ children, pathname, sticky = true, ...metadataProps }: PageLayoutProps) {
    let globalHeader = <GlobalHeader
        productWebUrl={releasesData?.latest?.url}
        hasSearch={true}
        searchConfig={searchConfig}
    />;

    if (!sticky) globalHeader = (
        <div className={styles.stickyHeader}>{globalHeader}</div>
    );

    return (
        <PageMetadata {...metadataProps}>
            <div className={styles.pageWrapper}>
                {globalHeader}
                {children}
                <ThemeProvider theme="dark">
                    <GlobalFooter />
                </ThemeProvider>
            </div>
        </PageMetadata>
    );
}
