import React from 'react';
import TopMenu from '@jetbrains/kotlin-web-site-ui/out/components/top-menu';
import Button from '@rescui/button';
import { SlackIcon } from '@rescui/icons';
import styles from './styles.module.scss';

const menuItems = [
  {
    url: '/education',
    title: 'Overview'
  },
  {
    url: '/education/why-teach-kotlin',
    title: 'Why Teach Kotlin'
  },
  {
    url: '/education/courses',
    title: 'List of Courses'
  },
];

interface TeachTopMenuProps {
  path: string;
}

export function TeachTopMenu({ path }: TeachTopMenuProps) {
  const activeIndex = menuItems.findIndex(item => item.url === path);

  return (
    <nav className={styles.stickyMenu}>
      <TopMenu
        items={menuItems}
        homeUrl="/education"
        title="Teach"
        activeIndex={activeIndex}
        mobileOverview={false}
      >
        <Button 
          icon={<SlackIcon />} 
          href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"
          target="_blank" 
          rel="noopener" 
          className={styles.button}
        >
          Join Educators
        </Button>
      </TopMenu>
    </nav>
  );
}