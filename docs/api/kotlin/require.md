---
layout: api
title: require
---
[stdlib](../index.html) / [kotlin](index.html) / [require](require.html)

# require
Throws an [[IllegalArgumentException]] with the *lazyMessage* if the *value* is false.
```
public fun require(value: Boolean, lazyMessage: ()->String): Unit
```
Throws an [[IllegalArgumentException]] with an optional *message* if the *value* is false.
```
public fun require(value: Boolean, message: Any): Unit
```
## Description
```
public fun require(value: Boolean, lazyMessage: ()->String): Unit
```
@includeFunctionBody ../../test/PreconditionsTest.kt failingRequireWithLazyMessage

```
public fun require(value: Boolean, message: Any): Unit
```
@includeFunctionBody ../../test/PreconditionsTest.kt failingRequireWithMessage

