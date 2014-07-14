---
layout: api
title: write
---
[stdlib](../index.html) / [kotlin.concurrent](index.html) / [write](write.html)

# write
Executes given calculation under write lock.
```
public fun <T> ReentrantReadWriteLock.write(action: ()->T): T
```
## Description
```
public fun <T> ReentrantReadWriteLock.write(action: ()->T): T
```
The method does upgrade from read to write lock if needed
If such write has been initiated by checking some condition, the condition must be rechecked inside the action to avoid possible races
Returns result of the calculation

