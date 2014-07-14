---
layout: api
title: MergingStream
---
[stdlib](../../index.html) / [kotlin](../index.html) / [MergingStream](index.html)

# MergingStream

```
public class MergingStream<T1, T2, V> 
```
## Members
| Name | Summary |
|------|---------|
|[*.init*](_init_.html)|&nbsp;&nbsp;`public MergingStream<T1, T2, V> (stream1: Stream<T1>, stream2: Stream<T2>, transform: (T1, T2)->V)`<br>|
|[iterator](iterator.html)|&nbsp;&nbsp;`open public fun iterator(): Iterator<V>`<br>|
|[stream1](stream1.html)|&nbsp;&nbsp;`val stream1: Stream<T1>`<br>|
|[stream2](stream2.html)|&nbsp;&nbsp;`val stream2: Stream<T2>`<br>|
|[transform](transform.html)|&nbsp;&nbsp;`val transform: (T1, T2)->V`<br>|
