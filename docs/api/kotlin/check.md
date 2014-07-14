---
layout: api
title: check
---
[stdlib](../index.md) / [kotlin](index.md) / [check](check.md)

# check
Throws an [[IllegalStateException]] with an optional *message* if the *value* is false.
```
public fun check(value: Boolean, message: Any): Unit
```
Throws an [[IllegalStateException]] with the *lazyMessage* if the *value* is false.
```
public fun check(value: Boolean, lazyMessage: ()->String): Unit
```
## Description
```
public fun check(value: Boolean, message: Any): Unit
```
@includeFunctionBody ../../test/PreconditionsTest.kt failingCheckWithMessage

```
public fun check(value: Boolean, lazyMessage: ()->String): Unit
```
@includeFunctionBody ../../test/PreconditionsTest.kt failingCheckWithLazyMessage

