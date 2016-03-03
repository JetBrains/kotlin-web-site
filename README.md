<a href="http://kotlinslackin.herokuapp.com"><img src="https://kotlinslackin.herokuapp.com/badge.svg" height="20"></a>

This is the source for the [Kotlin Web Site](http://kotlinlang.org)

- [Filing bugs](#filing-bugs)
- [Installation](#installation)
- [Working with site](#working-with-site)
    - [Rake tasks](#rake-tasks)
    - [Data](#data)
    - [Templates](#templates)
    - [Page metadata](#page-metadata)
    - [Writing an content](#writing-an-content)


Filing Bugs
===========
We use [YouTrack](http://youtrack.jetbrains.com/issues/KT#) for bug reports and suggestions. Click [here to report an issue](http://youtrack.jetbrains.com/newIssue?project=KT&clearDraft=true&c=Subsystems+Web+Site).

Installation
============

Site is based on [Jekyll](http://jekyllrb.com), so you will need ruby (>= 1.9.3) and rubygems to get it working.

- *Mac OS X*. Make sure that you have [Command Line Developer Tools](http://stackoverflow.com/questions/9329243/xcode-4-4-and-later-install-command-line-tools/9329325#9329325).
- *Windows*. Step-by-step Jekyll installation can be found [here](https://github.com/juthilo/run-jekyll-on-windows).
  We recommend to use [Cygwin](https://www.cygwin.com) or [Git Bash](http://git-scm.com) as command line interface.

Run `./INSTALL.sh` to install.

## PDF building

To build PDF you will also need [wkhtmltopdf](http://wkhtmltopdf.org/downloads.html):

- *Mac OS*. 0.12.1 testing build *10.6+ (Carbon)*.
- *Windows*. 0.12.1 testing build *Windows (MSVC 2013)*.
- *Linux*. Stable 0.12.0.

## Troubleshooting

- [Jekyll troubleshooting](http://jekyllrb.com/docs/troubleshooting)


Working with site
=================

## Rake tasks

Site uses [rake](https://github.com/ruby/rake) for build management.
To list available commands, run `rake` from project folder with no arguments.

- `rake build` generates site in the `_site` folder. Use `dest` parameter to specify another location: `rake build dest=/path`.
- `rake preview` runs built-in development server that will allow you to preview what the generated site will look like in your browser locally.
  Changed files are rebuilt automatically. Host address and port can be changed by passing the following parameters: `rake preview host=172.20.209.23 port=3000`
- `rake build_pdf` builds a PDF from documentation pages and stores it in the default folder. To change location, specify `file`: `rake build_pdf file=book.pdf`.

## Data

All data is stored in the \*.yml files in folder `_data`:

- [_nav.yml](_data/_nav.yml) site navigation and PDF building.
- [releases.yml](_data/releases.yml) info about releases.
- [videos.yml](_data/videos.yml) data for the Videos page. The `content` property is used to create categories.
  It contains a list of videos or other categories. Maximum tree depth level is 3.
- [events.yml](_data/events.yml) event data.

## Templates

Jekyll uses [Liquid](http://liquidmarkup.org) template engine.
You can use variables, loops, conditions and filters to define content of pages. More information can be found
[here](http://jekyllrb.com/docs/templates/) and [here](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers).

### Variables

The list of global variables accessible from each page can be found [here](http://jekyllrb.com/docs/variables/).
To access the folder data from `_data`, use the following syntax: `{{ site.data.%filename%.%key% }}`. E.g.:

- `{{ site.data._nav.main.try.url }}` - gets address for Try Kotlin page.
- `{{ site.data.releases.latest.version }}` - gets the latest Kotlin version.

## Page metadata

Every page can have an unlimited number of metadata fields. More information [here](http://jekyllrb.com/docs/frontmatter/).
The most important of them are the page template (e.g. `layout: reference`) and its type (e.g. `type: tutorial`). `category` and `title` fields are added for future development.


## Writing an content

### Markup

Kramdown with some additions (like GitHub fenced code blocks) is used as markdown parser.
See the complete syntax reference at [Kramdown site](http://kramdown.gettalong.org/syntax.html).

#### Markdown cheatsheet

In progress, see [this reference](http://kramdown.gettalong.org/syntax.html) instead.

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
