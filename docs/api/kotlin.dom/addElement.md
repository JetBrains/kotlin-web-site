---
layout: api
title: addElement
---
[stdlib](../index.html) / [kotlin.dom](index.html) / [addElement](addElement.html)

# addElement
Adds a newly created element to an element which has an owner Document which can be configured via a function
```
fun Element.addElement(name: String, doc: Document, init: Element.()->Unit): Element
```
Adds a newly created element which can be configured via a function
```
fun Document.addElement(name: String, init: Element.()->Unit): Element
```
