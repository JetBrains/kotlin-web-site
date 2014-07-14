---
layout: api
title: assert
---
[stdlib](../index.md) / [kotlin](index.md) / [assert](assert.md)

# assert
Throws an [[AssertionError]] with an optional *message* if the *value* is false
```
public fun assert(value: Boolean, message: Any): Unit
```
Throws an [[AssertionError]] with the specified *lazyMessage* if the *value* is false
```
public fun assert(value: Boolean, lazyMessage: ()->String): Unit
```
## Description
```
public fun assert(value: Boolean, message: Any): Unit
```
and runtime assertions have been enabled on the JVM using the *-ea* JVM option.

```
public fun assert(value: Boolean, lazyMessage: ()->String): Unit
```
and runtime assertions have been enabled on the JVM using the *-ea* JVM option.

