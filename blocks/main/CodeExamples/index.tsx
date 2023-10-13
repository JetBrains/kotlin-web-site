import { useCallback, useState } from "react";

import { useTextStyles } from "@rescui/typography";
import { Button } from "@rescui/button";
import { DownIcon } from "@rescui/icons";

import { useTS } from "@jetbrains/kotlin-web-site-ui/out/components/breakpoints";
import { SidebarMenu, SidebarMenuHeader } from "../../sidebar-menu";

const menuItems = [
  {
    children: 'Simple',
    href: '#example-simple',
  },
  {
    href: "#example-asynchronous",
    children: "Asynchronous",
  },
  {
    href: "#example-oop",
    children: "Object-oriented",
  },
  {
    href: "#example-functional",
    children: "Functional",
  },
  {
    href: "#example-tests",
    children: "Ideas for test",
  },
  {
    href: "...",
    target: '_blank',
    children: "Open in Playground",
  },
];

function SideHeader() {
  const textCn = useTextStyles();
  return (
    <SidebarMenuHeader className={textCn("rs-text-2")}>
      Code examples
    </SidebarMenuHeader>
  );
}

export function CodeExamples() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(0);

  const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);
  const onItemClick = useCallback((e, i) => {
    const item = menuItems[i];
    if (item.href.startsWith('#')) {
      e.preventDefault();
      setSelected(i);
    }
    setIsOpen(false);
  }, [setIsOpen]);

  const isTL = useTS();

  return <>
    <Button mode="clear" onClick={() => setIsOpen(!isOpen)} icon={<DownIcon/>} iconPosition="right">
      {menuItems[selected].children}
    </Button>
    {isTL && <SidebarMenu
      before={<SideHeader />}
      items={menuItems}
      activeIndex={selected}
      isOpen={isOpen}
      onClose={onClose}
      onItemClick={onItemClick}
    /> }
  </>;
}