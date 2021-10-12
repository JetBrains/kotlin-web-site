import React, {useState} from 'react';
import {TabList, Tab} from '@rescui/tab-list';
import {CoursesMap} from './components/courses-map.jsx';
import {CoursesList} from './components/courses-list.jsx';

import '@jetbrains/kotlin-web-site-ui/dist/typography.css';
import '@jetbrains/kotlin-web-site-ui/dist/grid.css';
import './index.scss';
import {TeachCtaBlock} from '../teach/components/teach-cta-block';
import {TeachTopMenu} from '../teach/components/teach-top-menu';

const Courses = ({universities, path}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <React.Fragment>
      <TeachTopMenu path={path} />

      <section className="ktl-container">
        <h1 className="ktl-h1 ktl-offset-top-xl">Universities That Teach Kotlin</h1>

        <div className="ktl-courses__tabs ktl-offset-top-m">
          <TabList short value={activeIndex} onChange={v => setActiveIndex(v)}>
            <Tab>Table view</Tab>
            <Tab>Map view</Tab>
          </TabList>
        </div>

        <div className="ktl-offset-top-m">
          {activeIndex ? <CoursesMap universities={universities}/> : <CoursesList universities={universities}/>}
        </div>
      </section>
      <section className="ktl-offset-top-xxl">
        <TeachCtaBlock />
      </section>
    </React.Fragment>
  );
}

export default Courses;
