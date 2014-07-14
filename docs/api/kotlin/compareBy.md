---
layout: api
title: compareBy
---
[stdlib](../index.html) / [kotlin](index.html) / [compareBy](compareBy.html)

# compareBy
Helper method for implementing [[Comparable]] methods using a list of functions
```
fun <T : T> compareBy(a: T, b: T, functions: Array<T.()->Comparable<Any>>): Int
```
## Description
```
fun <T : T> compareBy(a: T, b: T, functions: Array<T.()->Comparable<Any>>): Int
```
to calculate the values to compare

