import React from 'react';

import TopMenu from '@jetbrains/kotlin-web-site-ui/out/components/top-menu';
import {Button} from '@rescui/button';
import {SlackIcon} from '@rescui/icons';
import './teach-top-menu.scss';

const menuItems = [
  {
    url: '/education/',
    title: 'Overview'
  },
  {
    url: '/education/why-teach-kotlin.html',
    title: 'Why Teach Kotlin'
  },
  {
    url: '/education/courses.html',
    title: 'List of Courses'
  },
];

export const TeachTopMenu = ({path}) => {
  const activeIndex = menuItems.findIndex(item => item.url === path);

  return (
    <nav className="teach-sticky-menu">
      <TopMenu
        items={menuItems}
        homeUrl={'/education/'}
        title={'Teach'}
        activeIndex={activeIndex}
        mobileOverview={false}
      >
        <Button icon={<SlackIcon/>} href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"
                target="_blank" rel="noopener noreferrer" className="teach-sticky-menu__button">Join Educators</Button>
      </TopMenu>
    </nav>
  )
}