<a href="http://kotlinslackin.herokuapp.com"><img src="https://kotlinslackin.herokuapp.com/badge.svg" height="20"></a>

This is the source for the [Kotlin Web Site](http://kotlinlang.org)

- [Filing bugs](#filing-bugs)
- [Installation](#installation)
- [Working with site](#working-with-site)
    - [Run](#run-site)
    - [Data](#data)
    - [Templates](#templates)
    - [Page metadata](#page-metadata)
    - [Writing an content](#writing-an-content)


Filing Bugs
===========
We use [YouTrack](http://youtrack.jetbrains.com/issues/KT#) for bug reports and suggestions. Click [here to report an issue](http://youtrack.jetbrains.com/newIssue?project=KT&clearDraft=true&c=Subsystems+Web+Site).

Installation
============

## Prerequisites

- Python. Kotlinlang is [Flask](http://flask.pocoo.org/)-based site, so you'll need python 2 to get it working.
- ruby + [kramdown](http://kramdown.gettalong.org/installation.html). Python has a very poor support for markdown, so kramdown is used as markdown to html converter
- [nodejs](https://nodejs.org/en/) + npm to build frontend assets

## Installation

After installation of required tools run `npm i` to download all frontend dependencies and `pip install -r requirements.txt` to download backend dependencies.

Working with site
=================

## Run site

- Use `npm run build` command to build assets. If you are going to modify js/scss files use `npm start` instead.
- To run site use `pyhton kotlin-website.py` command 

## Data

All data is stored in the \*.yml files in folder `_data`:

- [_nav.yml](_data/_nav.yml) site navigation and PDF building.
- [releases.yml](_data/releases.yml) info about releases.
- [videos.yml](_data/videos.yml) data for the Videos page. The `content` property is used to create categories.
  It contains a list of videos or other categories. Maximum tree depth level is 3.
- [events.yml](_data/events.yml) event data.

## Templates

Kotlinlang uses [Jinja2](http://jinja.pocoo.org/docs/dev/) templates that can be found in templates folder.
Note, that before converting to html all markdown files are processed as jinja templates. This allows you to use all jinja power inside markdown (for example, build urls with url_for function)

## Page metadata

Every page can have an unlimited number of metadata fields. More information [here](http://jekyllrb.com/docs/frontmatter/).
The most important of them are the page template (e.g. `layout: reference`) and its type (e.g. `type: tutorial`). `category` and `title` fields are added for future development.


## Writing an content

### Markup

Kramdown with some additions (like GitHub fenced code blocks) is used as markdown parser.
See the complete syntax reference at [Kramdown site](http://kramdown.gettalong.org/syntax.html).

### Specifying page element attributes

With Kramdown you can assign HTML attributes to page elements via `{:%param%}`. E.g.:

- `*important text*{:.important}` - produces `<em class="important">important text</em>`
- `*important text*{:#id}` - produces `<em id="id">important text</em>`

For block elements this instruction must be specified on the line following element definition:

```
This is a paragraph
{:.important}

This is a paragraph
```

More information about attributes can be found [here](http://kramdown.gettalong.org/syntax.html#inline-attribute-lists).

### Custom element styles

#### Inline elements

- `{:.keyword}` highlights a keyword.
- `{:.error}` highlights an error.
- `{:.warning}` highlights a warning.

#### Tables

- `{:.wide}` stretches a table to occupy the entire width of a page.
- `{:.zebra}` interleaves table rows.

E.g.:

```
| Expression | Translated to |
|------------|---------------|
| `a++` | `a.inc()` + see below |
| `a--` | `a.dec()` + see below |
{:.wide.zebra}
```

#### Quotation blocks

They're used in a slightly other manner that they were originally designed for: as universal block container elements.

- `{:.note}` highlights a note block.

E.g.:

```
> **`inc()/dec()` shouldn't mutate the receiver object**.
>
> By "changing the receiver" we mean `the receiver-variable`, not the receiver object.
{:.note}
