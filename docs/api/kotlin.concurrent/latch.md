---
layout: api
title: latch
---
[stdlib](../index.html) / [kotlin.concurrent](index.html) / [latch](latch.html)

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

