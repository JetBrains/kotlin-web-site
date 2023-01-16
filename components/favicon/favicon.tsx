import React from 'react';

//import KotlinLogo from '@jetbrains/kotlin-web-site-ui/out/svg/logo.svg';

export const Favicon = () => {
    return (
        <>
            <link rel="icon" href="/assets/images/favicon.svg?v2" type="image/svg+xml" />
            <link rel="alternate icon" href="/assets/images/favicon.ico?v2" type="image/x-icon" />
            <link
                rel="apple-touch-icon"
                sizes="57x57"
                href="/assets/images/apple-touch-icon.png?v2"
            />
            <link
                rel="apple-touch-icon"
                sizes="72x72"
                href="/assets/images/apple-touch-icon-72x72.png?v2"
            />
            <link
                rel="apple-touch-icon"
                sizes="114x114"
                href="/assets/images/apple-touch-icon-114x114.png?v2"
            />
            <link
                rel="apple-touch-icon"
                sizes="144x144"
                href="/assets/images/apple-touch-icon-144x144.png?v2"
            />
        </>
    );
};
