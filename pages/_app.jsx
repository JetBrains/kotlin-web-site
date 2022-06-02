import React from 'react';

import 'normalize.css';
import './global.css';
import 'inter-ui/inter.css';
import '@jetbrains/kotlin-web-site-ui/out/components/typography/index.css';
import '@jetbrains/kotlin-web-site-ui/out/components/grid/index.css';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
