import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

export default async function main() {
    const name = process.argv[2];
    let props = {};

    if (process.argv[3]) {
        try {
            props = JSON.parse(process.argv[3]);
        } catch (e) {
            console.log(e);
            return;
        }
    }

    const componentPath = `../../static/js/ktl-component/${name}/index.jsx`;
    const component = await import(componentPath);
    const { default: Component } = component;
    let res = '';

    try {
        res = renderToString(createElement(Component, props))
    } catch (e) {
        res = e;
    }

    console.log(res);
}
