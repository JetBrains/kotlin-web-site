---
layout: api
title: TransformingStream
---
[stdlib](../../index.md) / [kotlin](../index.md) / [TransformingStream](index.md)

# TransformingStream

```
public class TransformingStream<T, R> 
```

## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|&nbsp;&nbsp;**`public TransformingStream<T, R> (stream: Stream<T>, transformer: (T)->R)`**<br>|
|[iterator](iterator.md)|&nbsp;&nbsp;**`open public fun iterator(): Iterator<R>`**<br>|
|[stream](stream.md)|&nbsp;&nbsp;**`val stream: Stream<T>`**<br>|
|[transformer](transformer.md)|&nbsp;&nbsp;**`val transformer: (T)->R`**<br>|
