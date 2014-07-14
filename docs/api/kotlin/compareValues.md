---
layout: api
title: compareValues
---
[stdlib](../index.html) / [kotlin](index.html) / [compareValues](compareValues.html)

# compareValues
Compares the two values which may be [[Comparable]] otherwise
```
public fun <T : T> compareValues(a: T, b: T): Int
```
## Description
```
public fun <T : T> compareValues(a: T, b: T): Int
```
they are compared via [[#equals()]] and if they are not the same then
the [[#hashCode()]] method is used as the difference

