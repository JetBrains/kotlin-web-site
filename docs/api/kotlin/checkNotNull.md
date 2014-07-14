---
layout: api
title: checkNotNull
---
[stdlib](../index.html) / [kotlin](index.html) / [checkNotNull](checkNotNull.html)

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

