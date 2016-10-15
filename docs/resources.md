---
layout: resources
title: More Resources
---

## Kotlin Community

Welcome to our friendly and actively growing [community](/community.html)!
Ask questions, receive help, give your feedback, contribute to the language and its infrastructure!

## Community-Maintained Links

You can find a community-maintained list of links to Kotlin projects, libraries and other resources at [Awesome Kotlin](http://kotlin.link/).

## Open Source Projects and Libraries

<table>
<thead>
<tr>
  <th>Name</th>
  <th>Description</th>
  <th>Type</th>
</tr>
</thead>
<tbody>
{% for project in site.data.oss-projects %}
<tr>
  <td><a href="{{ project.link }}">{{ project.name }}</a></td>
  <td>{{ project.description }}</td>
  <td>{{ project.type }}</td>
</tr>
{% endfor %}
</tbody>
</table>



