import React from 'react';
import { EducationLayout } from '../../blocks/education/layout/education-layout';
import { WhyTeach } from '../../blocks/education/why-teach/why-teach';

export default function WhyTeachKotlinPage() {
  return (
    <EducationLayout 
      title="Why teach Kotlin" 
      description="Discover why Kotlin is an excellent choice for teaching computer science and programming. Learn about its academic recognition, industry adoption, and educational benefits."
      ogImageName="education-why-teach.png"
    >
      <WhyTeach />
    </EducationLayout>
  );
}