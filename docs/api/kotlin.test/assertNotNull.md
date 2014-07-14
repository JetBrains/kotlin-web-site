---
layout: api
title: assertNotNull
---
[stdlib](../index.md) / [kotlin.test](index.md) / [assertNotNull](assertNotNull.md)

# assertNotNull
Asserts that the expression is not null, with an optional message and a function block to process the not-null value
```
public fun <T, R> assertNotNull(actual: T, block: (T)->R): Unit
public fun <T, R> assertNotNull(actual: T, message: String, block: (T)->R): Unit
```
Asserts that the expression is not null, with an optional message
```
public fun <T> assertNotNull(actual: T, message: String): T
```
