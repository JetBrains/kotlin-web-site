import React, { useEffect, useState } from "react";
import GlobalFooter from '@jetbrains/kotlin-web-site-ui/out/components/footer';
import { ThemeProvider } from '@rescui/ui-contexts';
import './index.scss';

const Footer = () => {
  return (
    <ThemeProvider theme={'dark'}>
      <GlobalFooter className={'ktl-footer_dark'} />
    </ThemeProvider>
  );
}

export default Footer;
