---
layout: api
title: schedule
---
[stdlib](../index.html) / [kotlin.concurrent](index.html) / [schedule](schedule.html)

# schedule

```
public fun Timer.schedule(delay: Long, period: Long, action: TimerTask.()->Unit): TimerTask
public fun Timer.schedule(delay: Long, action: TimerTask.()->Unit): TimerTask
public fun Timer.schedule(time: Date, period: Long, action: TimerTask.()->Unit): TimerTask
public fun Timer.schedule(time: Date, action: TimerTask.()->Unit): TimerTask
```
