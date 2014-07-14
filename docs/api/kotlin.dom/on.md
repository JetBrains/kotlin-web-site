---
layout: api
title: on
---
[stdlib](../index.html) / [kotlin.dom](index.html) / [on](on.html)

# on
Registers an [EventListener] on the named event
```
public fun Node.on(name: String, capture: Boolean, listener: EventListener): Closeable
```
Registers a handler on the named event
```
public fun Node.on(name: String, capture: Boolean, handler: (Event)->Unit): Closeable
```
