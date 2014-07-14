---
layout: api
title: assert
---
[stdlib](../index.html) / [kotlin](index.html) / [assert](assert.html)

# assert
Throws an [[AssertionError]] with the specified *lazyMessage* if the *value* is false
```
public fun assert(value: Boolean, lazyMessage: ()->String): Unit
```
Throws an [[AssertionError]] with an optional *message* if the *value* is false
```
public fun assert(value: Boolean, message: Any): Unit
```
## Description
```
public fun assert(value: Boolean, lazyMessage: ()->String): Unit
```
and runtime assertions have been enabled on the JVM using the *-ea* JVM option.

```
public fun assert(value: Boolean, message: Any): Unit
```
and runtime assertions have been enabled on the JVM using the *-ea* JVM option.

