---
layout: api
title: FlatteningStream
---
[stdlib](../../index.md) / [kotlin](../index.md) / [FlatteningStream](index.md)

# FlatteningStream

```
public class FlatteningStream<T, R> 
```

## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|&nbsp;&nbsp;**`public FlatteningStream<T, R> (stream: Stream<T>, transformer: (T)->Stream<R>)`**<br>|
|[iterator](iterator.md)|&nbsp;&nbsp;**`open public fun iterator(): Iterator<R>`**<br>|
|[stream](stream.md)|&nbsp;&nbsp;**`val stream: Stream<T>`**<br>|
|[transformer](transformer.md)|&nbsp;&nbsp;**`val transformer: (T)->Stream<R>`**<br>|
