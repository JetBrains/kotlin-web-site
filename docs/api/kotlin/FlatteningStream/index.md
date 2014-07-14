---
layout: api
title: FlatteningStream
---
[stdlib](../../index.html) / [kotlin](../index.html) / [FlatteningStream](index.html)

# FlatteningStream

```
public class FlatteningStream<T, R> 
```
## Members
| Name | Summary |
|------|---------|
|[*.init*](_init_.html)|&nbsp;&nbsp;`public FlatteningStream<T, R> (stream: Stream<T>, transformer: (T)->Stream<R>)`<br>|
|[iterator](iterator.html)|&nbsp;&nbsp;`open public fun iterator(): Iterator<R>`<br>|
|[stream](stream.html)|&nbsp;&nbsp;`val stream: Stream<T>`<br>|
|[transformer](transformer.html)|&nbsp;&nbsp;`val transformer: (T)->Stream<R>`<br>|
