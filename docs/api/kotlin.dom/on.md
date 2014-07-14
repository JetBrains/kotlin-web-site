---
layout: api
title: on
---
[stdlib](../index.md) / [kotlin.dom](index.md) / [on](on.md)

# on
Registers a handler on the named event
```
public fun Node.on(name: String, capture: Boolean, handler: (Event)->Unit): Closeable
```
Registers an [EventListener] on the named event
```
public fun Node.on(name: String, capture: Boolean, listener: EventListener): Closeable
```
