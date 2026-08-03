---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% if site.author.googlescholar %}
  <div class="wordwrap">You can also find my articles on <a href="{{site.author.googlescholar}}">my Google Scholar profile</a>.</div>
{% endif %}

{% include base_path %}

{% assign sorted_publications = site.publications | sort: 'date' | reverse %}
{% assign publications_by_year = sorted_publications | group_by_exp: 'post', 'post.date | date: "%Y"' %}
{% for year in publications_by_year %}
  <h2 class="archive__subtitle">{{ year.name }}</h2>
  {% for post in year.items %}
    {% include archive-single.html %}
  {% endfor %}
{% endfor %}
