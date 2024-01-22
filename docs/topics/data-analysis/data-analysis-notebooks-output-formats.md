[//]: # (title: Output formats supported by Kotlin Notebooks)

There will be examples for each output.

One key feature that makes notebooks stand out is the variety of output types they support:

## Text

This is the simplest type of output, and it includes printed statements, variable values, or any text-based output from your code. If a cell’s result doesn’t fall under one of the categories below, it will be printed as text via the toString() method.

## Rich text

Markdown cells produce rich text HTML output, offering support for lists, font styles, code blocks, and more.

## HTML markup

Jupyter notebooks can render HTML directly, enabling rich text formatting, the use of tables, or even the embedding of websites.

## Images

Static images can be displayed in formats such as PNG, JPEG, and SVG. Results of the BufferedImage type are also supported. All these images can be images from files, generated graphs, or any other visual media.

## LaTeX markup

Mathematical formulas and equations can be beautifully rendered using LaTeX, a typesetting system widely used in academia.

## Error and traceback

When code contains errors, notebooks display an error message and a traceback, providing insights for debugging.

## What's next

* Visualize data using the Kandy library
* Work with csv and json data
* Check out the list of supported libraries