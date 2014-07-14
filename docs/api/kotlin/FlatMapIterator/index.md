---
layout: api
title: FlatMapIterator
---
[stdlib](../../index.html) / [kotlin](../index.html) / [FlatMapIterator](index.html)

# FlatMapIterator

```
class FlatMapIterator<T, R> 
```
## Members
| Name | Summary |
|------|---------|
|[*.init*](_init_.html)|&nbsp;&nbsp;`public FlatMapIterator<T, R> (iterator: Iterator<T>, transform: (T)->Iterator<R>)`<br>|
|[computeNext](computeNext.html)|&nbsp;&nbsp;`open protected fun computeNext(): Unit`<br>|
|[iterator](iterator.html)|&nbsp;&nbsp;`val iterator: Iterator<T>`<br>|
|[transform](transform.html)|&nbsp;&nbsp;`val transform: (T)->Iterator<R>`<br>|
|[transformed](transformed.html)|&nbsp;&nbsp;`val transformed: Iterator<R>`<br>|
