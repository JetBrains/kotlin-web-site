---
layout: api
title: createElement
---
[stdlib](../index.md) / [kotlin.dom](index.md) / [createElement](createElement.md)

# createElement
Creates a new element which can be configured via a function
```
fun Document.createElement(name: String, init: Element.()->Unit): Element
```
Creates a new element to an element which has an owner Document which can be configured via a function
```
fun Element.createElement(name: String, doc: Document, init: Element.()->Unit): Element
```
