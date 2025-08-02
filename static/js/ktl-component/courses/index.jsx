import React, {useState} from 'react';
import {TabList, Tab} from '@rescui/tab-list';
import {CoursesList} from './components/courses-list.jsx';

import '@jetbrains/kotlin-web-site-ui/out/components/typography';
import '@jetbrains/kotlin-web-site-ui/out/components/grid';
import './index.scss';
import {TeachCtaBlock} from '../teach/components/teach-cta-block';
import {TeachTopMenu} from '../teach/components/teach-top-menu';
import {TeachMap} from '../teach/components/teach-map/teach-map.jsx';

const Courses = ({universities, path}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div data-test="teach-courses">
      <TeachTopMenu path={path} />

      <section className="ktl-layout ktl-layout--center">
        <h1 className="ktl-h1 ktl-offset-top-xl">Universities That Teach Kotlin</h1>

        <div className="ktl-courses__tabs ktl-offset-top-m">
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
}

export default Courses;
