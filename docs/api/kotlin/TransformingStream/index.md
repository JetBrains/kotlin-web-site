---
layout: api
title: TransformingStream
---
[stdlib](../../index.html) / [kotlin](../index.html) / [TransformingStream](index.html)

# TransformingStream

```
public class TransformingStream<T, R> 
```
## Members
| Name | Summary |
|------|---------|
|[*.init*](_init_.html)|&nbsp;&nbsp;`public TransformingStream<T, R> (stream: Stream<T>, transformer: (T)->R)`<br>|
|[iterator](iterator.html)|&nbsp;&nbsp;`open public fun iterator(): Iterator<R>`<br>|
|[stream](stream.html)|&nbsp;&nbsp;`val stream: Stream<T>`<br>|
|[transformer](transformer.html)|&nbsp;&nbsp;`val transformer: (T)->R`<br>|
