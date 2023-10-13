import React, { createContext, MouseEvent } from 'react';

import cn from 'classnames';
import { Menu } from '@rescui/menu';

import { Sidebar, SidebarProps } from '../sidebar';
import { SidebarMenuItem } from './menu-item';

import styles from './popup.module.css';

export type SidebarMenuProps = {
  activeIndex?: number;
  items: React.RefAttributes<HTMLElement>[];
  onItemClick?: (e: MouseEvent<HTMLElement>, index: number) => void;
  before?: React.ReactNode;
};

export function SidebarMenu({
  className,
  before,
  activeIndex,
  items,
  onItemClick,
  ...props
}: SidebarMenuProps & SidebarProps) {
  return (
    <Sidebar {...props} className={cn(className, styles.popup)}>
      {before}
      <Menu className={styles.menu}>
        {items.map((item, i) => (
          <SidebarMenuItem
            key={i}
            isActive={i === activeIndex}
            index={i}
            {...item}
            onClick={onItemClick}
          />
        ))}
      </Menu>
    </Sidebar>
  );
}

export * from './menu-header';
