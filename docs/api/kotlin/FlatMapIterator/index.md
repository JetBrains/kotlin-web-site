---
layout: api
title: FlatMapIterator
---
[stdlib](../../index.md) / [kotlin](../index.md) / [FlatMapIterator](index.md)

# FlatMapIterator

```
class FlatMapIterator<T, R> 
```

## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|&nbsp;&nbsp;**`public FlatMapIterator<T, R> (iterator: Iterator<T>, transform: (T)->Iterator<R>)`**<br>|
|[computeNext](computeNext.md)|&nbsp;&nbsp;**`open protected fun computeNext(): Unit`**<br>|
|[iterator](iterator.md)|&nbsp;&nbsp;**`val iterator: Iterator<T>`**<br>|
|[transform](transform.md)|&nbsp;&nbsp;**`val transform: (T)->Iterator<R>`**<br>|
|[transformed](transformed.md)|&nbsp;&nbsp;**`val transformed: Iterator<R>`**<br>|
