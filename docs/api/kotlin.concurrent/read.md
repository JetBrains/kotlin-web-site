---
layout: api
title: read
---
[stdlib](../index.html) / [kotlin.concurrent](index.html) / [read](read.html)

# read
Executes given calculation under read lock
```
public fun <T> ReentrantReadWriteLock.read(action: ()->T): T
```
## Description
```
public fun <T> ReentrantReadWriteLock.read(action: ()->T): T
```
Returns result of the calculation

