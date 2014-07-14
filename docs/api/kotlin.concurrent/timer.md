---
layout: api
title: timer
---
[stdlib](../index.html) / [kotlin.concurrent](index.html) / [timer](timer.html)

# timer

```
public fun timer(name: String, daemon: Boolean, startAt: Date, period: Long, action: TimerTask.()->Unit): Timer
public fun timer(name: String, daemon: Boolean, initialDelay: Long, period: Long, action: TimerTask.()->Unit): Timer
```
