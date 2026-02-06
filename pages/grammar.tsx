import { join } from 'node:path';
import { access, readFile } from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';

import { Grammar, GrammarXML } from '../blocks/grammar';
import { LandingLayout, LandingLayoutProps } from '../components/landing-layout/landing-layout';
import { ThemeProvider } from '@rescui/ui-contexts';

type GrammarPageProps = {
    data: GrammarXML;
};

const TOP_MENU_ITEMS: LandingLayoutProps['topMenuItems'] = [
    {
        title: 'Language specification',
        url: '/spec/introduction.html'
    }
];

export default function GrammarPage({ data }: GrammarPageProps) {
    return (
        <LandingLayout
            title={'Grammar - Kotlin Programming Language'} description={'Kotlin Grammar Reference'}
            topMenuTitle={'Grammar'}
            topMenuItems={TOP_MENU_ITEMS}
            canonical={'https://kotlinlang.org/grammar/'}
        >
            <ThemeProvider theme={'light'}>
                <Grammar data={data} />
            </ThemeProvider>
        </LandingLayout>
    );
}

const OPTIONS = {
    preserveOrder: true,
    ignoreAttributes: false
} as const;

export async function getStaticProps(): Promise<{ props: GrammarPageProps }> {
    const grammarFile = join(process.cwd(), 'grammar.xml');

    try {
        await access(grammarFile);
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Grammar page is NOT included by default in development mode');
            return { props: { data: [] } };
        }

        throw new Error(`Grammar page is NOT included. No file: ${grammarFile}`);
    }

    const xmlContent = await readFile(grammarFile, 'utf-8');
    const data: GrammarXML = new XMLParser(OPTIONS).parse(xmlContent)?.[0]?.tokens;

    return { props: { data } };
}
