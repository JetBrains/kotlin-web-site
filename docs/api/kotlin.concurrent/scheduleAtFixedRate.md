---
layout: api
title: scheduleAtFixedRate
---
[stdlib](../index.html) / [kotlin.concurrent](index.html) / [scheduleAtFixedRate](scheduleAtFixedRate.html)

# scheduleAtFixedRate

```
public fun Timer.scheduleAtFixedRate(delay: Long, period: Long, action: TimerTask.()->Unit): TimerTask
public fun Timer.scheduleAtFixedRate(time: Date, period: Long, action: TimerTask.()->Unit): TimerTask
```
