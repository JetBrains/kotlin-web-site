import React, { FC, useCallback, useMemo } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import GlobalHeader from '@jetbrains/kotlin-web-site-ui/out/components/header';
import GlobalFooter from '@jetbrains/kotlin-web-site-ui/out/components/footer';
import TopMenu from '@jetbrains/kotlin-web-site-ui/out/components/top-menu';
import { CtaBlock } from '@jetbrains/kotlin-web-site-ui/out/components/cta-block-v2';
import { Button } from '@rescui/button';
import { SlackIcon } from '@rescui/icons';
import { ThemeProvider } from '@rescui/ui-contexts';

import { StickyHeader } from '../../../components/sticky-header/sticky-header';
import styles from './education-layout.module.css';
import releasesDataRaw from '../../../data/releases.yml';
import searchConfig from '../../../search-config.json';

interface ReleasesData {
  latest: {
    url: string;
  };
}

const releasesData: ReleasesData = releasesDataRaw as ReleasesData;

// Constants for the education section
const EDUCATION_URL = '/education/';
const EDUCATION_TITLE = 'Teach';

const TOP_MENU_ITEMS = [
  {
    url: '/education/',
    title: 'Overview'
  },
  {
    url: '/education/why-teach-kotlin/',
    title: 'Why Teach Kotlin'
  },
  {
    url: '/education/courses/',
    title: 'List of Courses'
  }
];

interface EducationLayoutProps {
  title: string;
  description?: string;
  ogImageName?: string;
  children: React.ReactNode;
}

export const EducationLayout: FC<EducationLayoutProps> = ({ title, ogImageName, description, children }) => {
  const theme = 'dark';
  const router = useRouter();
  const pathname = addTrailingSlash(router.pathname);

  let items = TOP_MENU_ITEMS;

  let activeIndex = useMemo(
    () => items.map((item) => item.url).indexOf(pathname),
    [pathname, items]
  );

  const linkHandler = useCallback(
    (event, url) => {
      event.preventDefault();
      router.push(url);
    },
    [router]
  );

  const ogImagePath = useMemo(
    () => `https://kotlinlang.org/assets/images/open-graph/${ogImageName ? ogImageName : 'general.png'}`,
    [ogImageName]
  );

  const ogImageTwitterPath = useMemo(
    () => (ogImageName ? ogImagePath : 'https://kotlinlang.org/assets/images/twitter/general.png'),
    [ogImageName, ogImagePath]
  );

  if (activeIndex === -1) {
    activeIndex = items.length;
    items = [...items, {
      url: router.pathname + '/',
      title,
    }];
  }

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={'https://kotlinlang.org' + router.pathname} />

        <meta property="og:image" content={ogImagePath} />

        {description && <meta property="og:description" content={description} />}
        <meta property="og:site_name" content="Kotlin" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@kotlin" />
        <meta name="twitter:title" content={title} />
        {description && <meta name="twitter:description" content={description} />}
        <meta name="twitter:image:src" content={ogImageTwitterPath} />
      </Head>

      <GlobalHeader
        currentUrl={EDUCATION_URL}
        currentTitle={EDUCATION_TITLE}
        productWebUrl={releasesData.latest.url}
        hasSearch={true}
        searchConfig={searchConfig}
      />

      <StickyHeader>
        <div className={styles.sticky}>
          <TopMenu
            className={styles.topMenu}
            homeUrl={EDUCATION_URL}
            title={EDUCATION_TITLE}
            activeIndex={activeIndex}
            items={items}
            linkHandler={linkHandler}
            mobileOverview={false}
          >
            <Button 
              className={styles.slackButton}
              icon={<SlackIcon />}
              href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Educators
            </Button>
          </TopMenu>
        </div>
      </StickyHeader>

      {children}

      <CtaBlock
        topTitle={'Help us improve'}
        buttons={
          <Button size="l" mode="rock" href="mailto:education@kotlinlang.org">
            Write to us
          </Button>
        }
        mainTitle={
          <>
            Give us your feedback or ask any questions
            <br />
            you have about teaching Kotlin
          </>
        }
      />

      <ThemeProvider theme={theme}>
        <GlobalFooter />
      </ThemeProvider>
    </>
  );
};

function addTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}