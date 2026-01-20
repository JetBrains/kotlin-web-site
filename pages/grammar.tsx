import { join } from 'node:path';
import { access, readFile } from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';

import { Grammar } from '../blocks/grammar';
import { LandingLayout } from '../components/landing-layout/landing-layout';
import { GrammarXML } from '../blocks/grammar/entity';

type GrammarPageProps = {
    data: GrammarXML;
};

export default function GrammarPage({ data }: GrammarPageProps) {
    return (
        <LandingLayout title={'Grammar - Kotlin Programming Language'} description={'Kotlin Grammar Reference'}>
            <Grammar data={data} />
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
        throw new Error(`Grammar page is NOT included. No file: ${grammarFile}`);
    }

    const xmlContent = await readFile(grammarFile, 'utf-8');
    const data: GrammarXML = new XMLParser(OPTIONS).parse(xmlContent)?.[0]?.tokens;

    return { props: { data } };
}
