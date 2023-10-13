import React, { MouseEvent, useCallback } from 'react';

import { MenuItem } from '@rescui/menu';

type SidebarMenuItemProps = {
  index: number;
  isActive: boolean;
  onClick?: (e: MouseEvent<HTMLElement>, index: number) => void;
};

export function SidebarMenuItem({
  index,
  isActive,
  onClick,
  ...props
}: SidebarMenuItemProps) {
  const handleClick = useCallback(
    (e) => {
      if (onClick) onClick(e, index);
    },
    [onClick, index]
  );

  return <MenuItem selected={isActive} {...props} onClick={handleClick} />;
}
