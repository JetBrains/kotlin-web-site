import React from 'react';
import { GetStaticProps } from 'next';
import { EducationLayout } from '../../blocks/education/layout/education-layout';
import { Courses } from '../../blocks/education/courses/courses';
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

interface CoursesPageProps {
  universities: University[];
}

export default function CoursesPage({ universities }: CoursesPageProps) {
  return (
    <EducationLayout 
      title="Universities That Teach Kotlin" 
      description="Explore the list of universities around the world that include Kotlin in their computer science courses. Find courses in your country or region."
      ogImageName="education-courses.png"
    >
      <Courses universities={universities} />
    </EducationLayout>
  );
}

export const getStaticProps: GetStaticProps<CoursesPageProps> = async () => {
  // Process the universities data to extract only the needed fields
  const universitiesData = universitiesDataRaw as UniversitiesData;
  const universities = universitiesData.map(university => ({
    title: university.title,
    location: university.location,
    courses: university.courses
  }));

  return {
    props: {
      universities,
    },
  };
};