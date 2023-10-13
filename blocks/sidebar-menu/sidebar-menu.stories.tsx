import React, { ComponentProps, useState } from 'react';

import { Meta, Story } from '@storybook/react';

import { Theme, ThemeProvider } from '@rescui/ui-contexts';
import { useTextStyles } from '@rescui/typography';
import Button from '@rescui/button';

import { SidebarMenu, SidebarMenuProps, SidebarMenuHeader } from './index';

export default { title: 'SidebarMenu' } as Meta;

type SideMenuProps = {
  name: string;
} & Pick<SidebarMenuProps, 'before'>;

const items = [
  { children: 'Item 1' },
  { children: 'Item 2' },
  { children: 'Item 3' },
  {
    href: 'link',
    children: 'Link 1',
  },
];

function Side({ name, ...props }: SideMenuProps) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button mode="classic" size="m" onClick={() => setOpen(!isOpen)}>
        {name}
      </Button>
      <SidebarMenu
        {...props}
        isOpen={isOpen}
        items={items}
        activeIndex={0}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

function Default() {
  const textCn = useTextStyles();

  return (
    <SidebarMenuHeader className={textCn('rs-text-2')}>
      <div className={textCn('rs-h2')}>!!!</div>
    </SidebarMenuHeader>
  );
}

function UserComponent() {
  const textCn = useTextStyles();
  return <div className={textCn('rs-h2')}>User header</div>;
}

const Template: Story<ComponentProps<any>> = (args) => {
  const [theme, setTheme] = useState<Theme>('light');
  const onClick = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const inlineStyles = {
    marginTop: '16px',
  };

  const containerStyles = {
    backgroundColor: theme === 'light' ? '#ffffff' : '#19191C',
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <ThemeProvider theme={theme}>
      <div style={containerStyles}>
        <h1>Sidebar Menu</h1>

        <button onClick={onClick} style={inlineStyles}>
          Switch theme
        </button>

        <ul style={{ listStyle: 'none' }}>
          <li>
            <Side name="simple" />
          </li>
          <li style={{ margin: '10px 0' }}>
            <Side name="with custom header" before={<UserComponent />} />
          </li>
          <li>
            <Side name="with default header" before={<Default />} />
          </li>
        </ul>
      </div>
    </ThemeProvider>
  );
};

export const BaseExample = Template.bind({});
BaseExample.args = {};
