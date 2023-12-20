import React, { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

import 'normalize.css';
import './global.css';
import 'inter-ui/inter.css';
import '@jetbrains/kotlin-web-site-ui/out/components/typography/index.css';
import '@jetbrains/kotlin-web-site-ui/out/components/grid/index.css';
import { Favicon } from '../components/favicon/favicon';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    useEffect(() => {
        document.body.className = pageProps.isDarkTheme ? 'dark-theme' : '';
    });

    return (
        <>
            <Head>
                <Favicon />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <Script
                id={'google-tag-manager-inline-script'}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5P98');`,
                }}
            ></Script>

            <noscript>
                <iframe
                    src="https://www.googletagmanager.com/ns.html?id=GTM-5P98"
                    height="0"
                    width="0"
                    style={{ display: 'none', visibility: 'hidden' }}
                ></iframe>
            </noscript>

            <Component {...pageProps} />
        </>
    );
}
