import React, { FC, useState } from 'react';
import { TabList, Tab } from '@rescui/tab-list';

import '@jetbrains/kotlin-web-site-ui/out/components/typography';
import '@jetbrains/kotlin-web-site-ui/out/components/grid';

import styles from './courses.module.css';
import { CoursesList } from './components/courses-list';
import { TeachCtaBlock } from '../../../static/js/ktl-component/teach/components/teach-cta-block';
import { TeachMap } from '../../../static/js/ktl-component/teach/components/teach-map/teach-map.jsx';

interface Course {
  name: string;
  url: string;
}

interface University {
  title: string;
  location: string;
  courses: Course[];
}

interface CoursesProps {
  universities: University[];
}

export const Courses: FC<CoursesProps> = ({ universities }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <div data-test="teach-courses">
      <section className="ktl-layout ktl-layout--center">
        <h1 className="ktl-h1 ktl-offset-top-xl">Universities That Teach Kotlin</h1>

        <div className={`${styles.tabs} ktl-offset-top-m`}>
          <TabList short value={activeIndex} onChange={setActiveIndex}>
            <Tab>Table view</Tab>
            <Tab>Map view</Tab>
          </TabList>
        </div>

        <div className="ktl-offset-top-m">
          {activeIndex ? <TeachMap /> : <CoursesList universities={universities}/>}
        </div>
      </section>
      
      <section className="ktl-offset-top-xxl">
        <TeachCtaBlock />
      </section>
    </div>
  );
};