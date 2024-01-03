import React, { useEffect, useState } from "react";
import GlobalFooter from '@jetbrains/kotlin-web-site-ui/out/components/footer-compact';
import { ThemeProvider } from '@rescui/ui-contexts';
import './index.scss';

const Footer = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (typeof document !== `undefined`) {
      const htmlEl = document.querySelector("html");
      const isInitialThemeIsDark = htmlEl.classList.contains("theme-dark");

      if (isInitialThemeIsDark) {
        setTheme('dark');
      }

      function callback(mutationList) {
        mutationList.forEach(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            setTheme(htmlEl.classList.contains("theme-dark") ? 'dark' : 'light');
          }
        });
      }

      const observer = new MutationObserver(callback)
      observer.observe(htmlEl, {
        attributes: true
      });

      return observer.disconnect;
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalFooter className={theme === 'dark' ? 'ktl-footer_dark' : 'ktl-footer_light'} />
    </ThemeProvider>
  );
}

export default Footer;
