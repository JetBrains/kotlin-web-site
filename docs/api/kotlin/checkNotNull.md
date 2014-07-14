---
layout: api
title: checkNotNull
---
[stdlib](../index.md) / [kotlin](index.md) / [checkNotNull](checkNotNull.md)

# checkNotNull
Throws an [[IllegalStateException]] with the given *message* if the *value* is null otherwise
```
public fun <T : T> checkNotNull(value: T, message: String): T
```
## Description
```
public fun <T : T> checkNotNull(value: T, message: String): T
```
the not null value is returned.
@includeFunctionBody ../../test/PreconditionsTest.kt checkNotNull

