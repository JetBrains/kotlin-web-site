---
layout: api
title: scheduleAtFixedRate
---
[stdlib](../index.md) / [kotlin.concurrent](index.md) / [scheduleAtFixedRate](scheduleAtFixedRate.md)

# scheduleAtFixedRate

```
public fun Timer.scheduleAtFixedRate(delay: Long, period: Long, action: TimerTask.()->Unit): TimerTask
public fun Timer.scheduleAtFixedRate(time: Date, period: Long, action: TimerTask.()->Unit): TimerTask
```
