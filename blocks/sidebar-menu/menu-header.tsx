import React, { useContext } from 'react';
import cn from 'classnames';

import { useTheme } from '@rescui/ui-contexts';
import { CloseIcon } from '@rescui/icons';
import Button from '@rescui/button';

import styles from './menu-header.module.css';
import { useSidebarContext } from '../sidebar';

export type SidebarMenuHeaderProps = {
  className?: string;
  children: React.ReactNode;
  onClose?: () => void;
};

export function SidebarMenuHeader({
  className,
  children,
  onClose,
}: SidebarMenuHeaderProps) {
  const theme = useTheme();
  const { onClose: onCloseContext } = useSidebarContext();
  const close = onClose || onCloseContext;

  return (
    <div className={cn(styles[theme || 'light'], className, styles.header)}>
      {children}
      <Button
        aria-label="close menu"
        mode="clear"
        className={styles.trigger}
        onClick={close}
        icon={<CloseIcon />}
      />
    </div>
  );
}
