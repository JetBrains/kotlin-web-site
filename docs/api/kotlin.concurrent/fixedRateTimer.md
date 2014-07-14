---
layout: api
title: fixedRateTimer
---
[stdlib](../index.html) / [kotlin.concurrent](index.html) / [fixedRateTimer](fixedRateTimer.html)

# fixedRateTimer

```
public fun fixedRateTimer(name: String, daemon: Boolean, initialDelay: Long, period: Long, action: TimerTask.()->Unit): Timer
public fun fixedRateTimer(name: String, daemon: Boolean, startAt: Date, period: Long, action: TimerTask.()->Unit): Timer
```
