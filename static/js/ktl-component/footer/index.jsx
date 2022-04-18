import React from "react";
import GlobalFooter from '@jetbrains/kotlin-web-site-ui/out/components/footer';
import { ThemeProvider } from '@rescui/ui-contexts';

const Footer = (props) => {
  return (
    <ThemeProvider theme="dark">
      <GlobalFooter { ... props } />
    </ThemeProvider>
  );
}

export default Footer;
