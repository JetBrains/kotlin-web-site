---
layout: api
title: latch
---
[stdlib](../index.md) / [kotlin.concurrent](index.md) / [latch](latch.md)

# latch
Execute given calculation and await for CountDownLatch
```
fun <T> Int.latch(op: CountDownLatch.()->T): T
```
## Description
```
fun <T> Int.latch(op: CountDownLatch.()->T): T
```
Returns result of the calculation

