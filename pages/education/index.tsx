import React from 'react';
import { GetStaticProps } from 'next';
import { EducationLayout } from '../../blocks/education/layout/education-layout';
import { Teach } from '../../blocks/education/teach/teach';
import universitiesDataRaw from '../../data/universities.yml';

interface University {
  title: string;
  location: string;
  courses: Array<{
    name: string;
    url: string;
  }>;
}

interface UniversitiesData extends Array<University> {}

interface EducationPageProps {
  universitiesCount: number;
  countriesCount: number;
}

export default function EducationPage({ universitiesCount, countriesCount }: EducationPageProps) {
  return (
    <EducationLayout 
      title="Teach Computer Science with Kotlin" 
      description="Kotlin is a modern programming language that is concise, safe, and fully interoperable with Java. Learn how to teach Kotlin in your computer science courses."
      ogImageName="education.png"
    >
      <Teach 
        universitiesCount={universitiesCount} 
        countriesCount={countriesCount} 
      />
    </EducationLayout>
  );
}

export const getStaticProps: GetStaticProps<EducationPageProps> = async () => {
  const universitiesData = universitiesDataRaw as UniversitiesData;
  const universitiesCount = universitiesData.length;
  const countriesCount = getCountriesCount(universitiesData);

  return {
    props: {
      universitiesCount,
      countriesCount,
    },
  };
};

function getCountriesCount(universities: UniversitiesData): number {
  const countries = new Set<string>();
  universities.forEach(university => {
    const location = university.location;
    const country = location.split(',').pop()?.trim();
    if (country) {
      countries.add(country);
    }
  });
  return countries.size;
}