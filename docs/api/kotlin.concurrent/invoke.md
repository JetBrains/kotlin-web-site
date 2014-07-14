---
layout: api
title: invoke
---
[stdlib](../index.md) / [kotlin.concurrent](index.md) / [invoke](invoke.md)

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

