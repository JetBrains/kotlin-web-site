---
layout: api
title: MergingStream
---
[stdlib](../../index.md) / [kotlin](../index.md) / [MergingStream](index.md)

# MergingStream

```
public class MergingStream<T1, T2, V> 
```

## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|&nbsp;&nbsp;**`public MergingStream<T1, T2, V> (stream1: Stream<T1>, stream2: Stream<T2>, transform: (T1, T2)->V)`**<br>|
|[iterator](iterator.md)|&nbsp;&nbsp;**`open public fun iterator(): Iterator<V>`**<br>|
|[stream1](stream1.md)|&nbsp;&nbsp;**`val stream1: Stream<T1>`**<br>|
|[stream2](stream2.md)|&nbsp;&nbsp;**`val stream2: Stream<T2>`**<br>|
|[transform](transform.md)|&nbsp;&nbsp;**`val transform: (T1, T2)->V`**<br>|
