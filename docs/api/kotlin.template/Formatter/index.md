---
layout: api
title: Formatter
---
[stdlib](../../index.html) / [kotlin.template](../index.html) / [Formatter](index.html)

# Formatter
Represents a formatter and encoder of values in a [[StringTemplate]] which understands
```
abstract public trait Formatter
```
## Description
```
abstract public trait Formatter
```
how to format values for a particular [[Locale]] such as with the [[LocaleFormatter]] or
to escape particular characters in different output formats such as [[HtmlFormatter]

## Members
| Name | Summary |
|------|---------|
|[format](format.html)|&nbsp;&nbsp;`abstract public fun format(buffer: Appendable, value: Any): Unit`<br>|
