import Document, { Html, Head, Main, NextScript } from 'next/document';
import cn from 'classnames';

export default class MyDocument extends Document {
    render() {
        const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps;
        return (
            <Html lang="en" className="no-js">
                <Head>
                    <script dangerouslySetInnerHTML={{
                        __html: `document.documentElement.classList.replace('no-js', 'js');`,
                    }}/>
                </Head>
                <body className={cn(pageProps.isDarkTheme ? 'dark-theme' : '', 'nextjs')}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
