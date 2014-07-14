---
layout: api
title: timer
---
[stdlib](../index.md) / [kotlin.concurrent](index.md) / [timer](timer.md)

# timer

```
public fun timer(name: String, daemon: Boolean, initialDelay: Long, period: Long, action: TimerTask.()->Unit): Timer
public fun timer(name: String, daemon: Boolean, startAt: Date, period: Long, action: TimerTask.()->Unit): Timer
```
