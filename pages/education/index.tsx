import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

// Import the Teach component
import Teach from '../../components/education/Teach';

interface University {
  title: string;
  location: string;
  courses: { name: string; url: string }[];
  geo: { lat: number; lng: number };
}

interface TeachPageProps {
  countriesCount: number;
  universitiesCount: number;
}

export const getStaticProps: GetStaticProps<TeachPageProps> = async () => {
  const universitiesFile = path.join(process.cwd(), 'data', 'universities.yml');
  const fileContents = fs.readFileSync(universitiesFile, 'utf8');
  const universities = yaml.load(fileContents) as University[];

  // Calculate unique countries count
  const uniqueCountries = new Set(universities.map(uni => uni.location.split(',').pop()?.trim()));
  const countriesCount = uniqueCountries.size;

  // Get total universities count
  const universitiesCount = universities.length;

  return {
    props: {
      countriesCount,
      universitiesCount,
    },
  };
};

export default function TeachPage({ countriesCount, universitiesCount }: TeachPageProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Kotlin for Education</title>
        <meta property="og:title" content="Kotlin for Education" />
        <meta property="og:image" content="/images/open-graph/education.png" />
      </Head>

      <Teach
        path={router.asPath}
        countriesCount={countriesCount}
        universitiesCount={universitiesCount}
      />
    </>
  );
}