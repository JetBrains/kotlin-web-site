---
layout: resources
title: More Resources
---

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



