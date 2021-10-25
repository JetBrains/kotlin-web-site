import React from 'react';

import TopMenu from '@jetbrains/kotlin-web-site-ui/dist/topMenu';
import '@jetbrains/kotlin-web-site-ui/dist/topMenu.css';

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
    url: 'https://docs.google.com/spreadsheets/d/1p77WHo--mxewmxINWMLaTPGXvnEr0JGxgSMcX6C0b_0/edit?usp=sharing',
    title: 'List of Courses'
  },
];

export const TeachTopMenu = ({path}) => {

  const activeIndex = menuItems.findIndex(item => item.url === path);

  return (
    <nav className="teach-sticky-menu">
      <TopMenu
        items={menuItems}
        homeUrl={'/'}
        title={'Teach'}
        activeIndex={activeIndex}
      >
        <a href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators" target="_blank"
           className="kto-button kto-button_theme_dark kto-button_size_s kto-button_mode_primary">
          <img src="/assets/images/ktl-component/teach/icons/teach-slack-icon.svg"
               className="teach-button-icon teach-button-icon_small" alt="Slack icon"/>
          Join educators
        </a>
      </TopMenu>
    </nav>
  )
}