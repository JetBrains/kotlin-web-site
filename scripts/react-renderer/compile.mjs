import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

export default async function main() {
    const name = process.argv[2];
    const props = process.argv[3] ? JSON.parse(process.argv[3]): {};
    const component = await import(`../../node_modules/@jetbrains/kotlin-web-site-ui/dist/${name}.js`);
    const { default: Component } = component;
    console.log(renderToString(createElement(Component, props)));
}
