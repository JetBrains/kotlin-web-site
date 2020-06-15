import $ from 'jquery';
import Map from "../events/map/Map";

import "./education.scss";

function convertToPoints(universities) {
    return universities
        .filter(university => university.geo)
        .map(university => ({
            alt: university.title,
            title: `<b>${university.title}</b><br>
${university.location}
<br>
<br>
Сourse:<br>
${university.courses.map(course => `<a target="_blank" href="${course.url}">${course.name}</a>`).join('')}`,
            city: {
                position: {
                    lat: parseFloat(university.geo.lat),
                    lng: parseFloat(university.geo.lng),
                }
            }
        }))
}

async function renderUniversitiesMap(tag) {
    const universities = await $.getJSON('/data/universities.json');

    Map.create(tag, {
        events: convertToPoints(universities)
    });
}

$(function () {
    const container = $('.edu-universities-top')[0];

    if (container) {
        const tag = document.createElement('div');
        tag.className = "edu-universities-map";
        tag.textContent = "Loading map...";

        renderUniversitiesMap(tag); // async

        const { parentNode, nextSibling } = container;

        if (nextSibling) {
            parentNode.insertBefore(tag, nextSibling);
        } else {
            parentNode.appendChild()
        }
    }
});
