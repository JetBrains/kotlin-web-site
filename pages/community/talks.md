---
title: Kotlin Events
layout: default-v2
---

# Kotlin talks and speakers support

If you are a Kotlin speaker, please let us know about your upcoming talks via filling out [this form](https://surveys.jetbrains.com/s3/Submit-a-Kotlin-Talk)
and we will announce your talks at kotlinlang.org. We'll also be glad to ship a t-shirt for you and some stickers and swag for the attendees of your event.

<br/>


<div id="events" class="events">

    <div class="events-list-col">
        <div class="events-list js-events-list"></div>
    </div>

    <div class="events-map-col">
        <div class="js-events-map-panel-wrap">
            <div class="events-map-panel js-events-map-panel">
                <div class="map js-map"></div>
            </div>
        </div>
    </div>

</div>

<script src="{{ url_for('static', filename='events.js') }}"></script>
<link rel="stylesheet" href="{{ url_for('static', filename='events.css')|autoversion }}">