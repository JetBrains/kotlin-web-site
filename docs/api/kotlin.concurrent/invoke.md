---
layout: api
title: invoke
---
[stdlib](../index.html) / [kotlin.concurrent](index.html) / [invoke](invoke.html)

# invoke
Allows you to use the executor as a function to
```
public fun <T> ExecutorService.invoke(action: ()->T): Future<T>
public fun Executor.invoke(action: ()->Unit): Unit
```
## Description
```
public fun <T> ExecutorService.invoke(action: ()->T): Future<T>
```
execute the given block on the [[Executor]].

```
public fun Executor.invoke(action: ()->Unit): Unit
```
execute the given block on the [[Executor]].

