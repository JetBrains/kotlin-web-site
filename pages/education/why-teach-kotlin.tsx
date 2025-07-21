import React from 'react';
import { Index } from '../../blocks/education/layout';
import { WhyTeach } from '../../blocks/education/why-teach/why-teach';

export default function WhyTeachKotlinPage() {
  return (
    <Index
      title="Why teach Kotlin" 
      description="Discover why Kotlin is an excellent choice for teaching computer science and programming. Learn about its academic recognition, industry adoption, and educational benefits."
      ogImage="education-why-teach.png"
    >
      <WhyTeach />
    </Index>
  );
}