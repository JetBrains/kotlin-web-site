---
layout: api
title: compareBy
---
[stdlib](../index.md) / [kotlin](index.md) / [compareBy](compareBy.md)

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

