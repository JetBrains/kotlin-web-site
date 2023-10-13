import React, { ComponentProps, useState } from 'react';

import { Meta, Story } from '@storybook/react';

import { Theme, ThemeProvider } from '@rescui/ui-contexts';
import Button from '@rescui/button';

import { Sidebar, SidebarProps } from './index';
import { CloseIcon } from '@rescui/icons';
import { useTextStyles } from '@rescui/typography';

export default { title: 'Sidebar' } as Meta;

type SideProps = {
  name: string;
} & Pick<SidebarProps, 'mode'>;

function Side({ name, ...props }: SideProps) {
  const textCn = useTextStyles();
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button mode="classic" size="m" onClick={() => setOpen(!isOpen)}>
        {name}
      </Button>
      <Sidebar {...props} isOpen={isOpen} onClose={() => setOpen(false)}>
        <div className={textCn('rs-text-1')}>
          Some more test content{' '}
          <Button
            size="s"
            mode="outline"
            onClick={() => setOpen(false)}
            icon={<CloseIcon />}
            iconPosition="right"
          >
            close
          </Button>
        </div>
      </Sidebar>
    </>
  );
}

const Template: Story<ComponentProps<any>> = (args) => {
  const [theme, setTheme] = useState<Theme>('light');
  const textCn = useTextStyles();
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
        <h1 className={textCn('rs-h1')}>Sidebar</h1>

        <button onClick={onClick} style={inlineStyles}>
          Switch theme
        </button>

        <ul style={{ listStyle: 'none' }}>
          <li>
            <Side name="mode=adaptive (default)" />
          </li>
          <li style={{ margin: '10px 0' }}>
            <Side name="mode=tablet" mode="tablet" />
          </li>
          <li>
            <Side name="mode=mobile" mode="mobile" />
          </li>
        </ul>
      </div>
    </ThemeProvider>
  );
};

export const BaseExample = Template.bind({});
BaseExample.args = {};
