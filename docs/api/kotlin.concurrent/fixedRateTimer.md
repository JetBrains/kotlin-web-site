---
layout: api
title: fixedRateTimer
---
[stdlib](../index.md) / [kotlin.concurrent](index.md) / [fixedRateTimer](fixedRateTimer.md)

# fixedRateTimer

```
public fun fixedRateTimer(name: String, daemon: Boolean, initialDelay: Long, period: Long, action: TimerTask.()->Unit): Timer
public fun fixedRateTimer(name: String, daemon: Boolean, startAt: Date, period: Long, action: TimerTask.()->Unit): Timer
```
