import React, {
  createContext,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from 'react';
import cn from 'classnames';
import { RemoveScrollBar } from 'react-remove-scroll-bar';
import { useTheme } from '@rescui/ui-contexts';

import styles from './sidebar.module.css';

export type SidebarContextType = {
  onClose?: () => void;
};

export const SidebarContext = createContext<SidebarContextType>({});

export function useSidebarContext() {
  return useContext(SidebarContext);
}

export type SidebarProps = {
  className?: string;
  classNameContent?: string;
  mode?: 'adaptive' | 'tablet' | 'mobile';
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
};

export function Sidebar({
  className,
  classNameContent,
  mode,
  children,
  isOpen,
  onClose,
}: SidebarProps) {
  const ref = useRef(null);
  const theme = useTheme();

  const onToggleClick = useCallback(
    (e) => {
      if (e.currentTarget == e.target) onClose();
    },
    [onClose]
  );

  const classes = cn(className, styles.popup, styles[theme || 'light'], {
    [styles.close]: !isOpen,
    [styles[`${mode}Mode`]]: Boolean(mode && styles[`${mode}Mode`]),
  });

  const disableProps: HTMLAttributes<HTMLDivElement> = {};

  if (!isOpen) {
    disableProps.tabIndex = -1;
    disableProps.role = 'none';
  }

  return (
    <SidebarContext.Provider value={{ onClose }}>
      <div className={classes} onClick={onToggleClick} {...disableProps}>
        {isOpen && <RemoveScrollBar />}
        <div ref={ref} className={cn(classNameContent, styles.content)}>
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
