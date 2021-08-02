import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

export default async function main() {
     try {
         const name = process.argv[2];
         let props = process.argv[3] ? JSON.parse(process.argv[3]): {};
         const componentPath = `../../static/js/ktl-component/${name}/index.jsx`;
         const component = await import(componentPath);
         const { default: Component } = component;
         console.log(renderToString(createElement(Component, props)));
     } catch (e) {
         console.error(e);
         process.exit(1);
     }
}
