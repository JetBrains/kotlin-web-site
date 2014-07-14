---
layout: api
title: read
---
[stdlib](../index.md) / [kotlin.concurrent](index.md) / [read](read.md)

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

