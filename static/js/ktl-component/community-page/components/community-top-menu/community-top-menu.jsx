import React from 'react';

import TopMenu from '@jetbrains/kotlin-web-site-ui/dist/topMenu';
import '@jetbrains/kotlin-web-site-ui/dist/topMenu.css';
import './style.scss';

const menuItems = [
  {
    url: '/community/',
    title: 'Overview'
  },
  {
    url: '/',
    title: 'Kotlin User Groups'
  },
  {
    url: '/',
    title: 'Events'
  },
];

export const CommunityTopMenu = ({path}) => {
  const activeIndex = menuItems.findIndex(item => item.url === path);

  return (
    <nav className="community-sticky-menu">
      <TopMenu
        items={menuItems}
        homeUrl={'/community/'}
        title={'Community'}
        activeIndex={activeIndex}
        mobileOverview={false}
      />
    </nav>
  )
}
