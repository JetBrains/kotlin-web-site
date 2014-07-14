---
layout: api
title: elements
---
[stdlib](../index.html) / [kotlin.dom](index.html) / [elements](elements.html)

# elements
Returns all the descendant elements given the namespace URI and local element name
```
fun Document.elements(namespaceUri: String, localName: String): List<Element>
fun Element.elements(namespaceUri: String, localName: String): List<Element>
```
Returns all the descendant elements given the local element name
```
fun Document.elements(localName: String): List<Element>
fun Element.elements(localName: String): List<Element>
```
