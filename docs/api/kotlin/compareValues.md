---
layout: api
title: compareValues
---
[stdlib](../index.md) / [kotlin](index.md) / [compareValues](compareValues.md)

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

