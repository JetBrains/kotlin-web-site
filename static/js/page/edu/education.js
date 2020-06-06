import $ from 'jquery';
import Map from "../events/map/Map";
import store from "./store.json"

import "./education.scss";

$(function () {
    const container = $('.edu-universities-top')[0];

    if (container) {
        const tag = document.createElement('div');
        tag.className = "edu-universities-map";
        tag.textContent = "Loading map...";
        Map.create(tag, store);

        const { parentNode, nextSibling } = container;

        if (nextSibling) {
            parentNode.insertBefore(tag, nextSibling);
        } else {
            parentNode.appendChild()
        }
    }
});
