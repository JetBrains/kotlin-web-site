import Document, { Html, Head, Main, NextScript } from 'next/document';
import cn from 'classnames';

export default class MyDocument extends Document {
    render() {
        const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps;
        return (
            <Html lang="en">
                <Head />
                <body className={cn(pageProps.isDarkTheme ? 'dark-theme' : '', 'nextjs')}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
