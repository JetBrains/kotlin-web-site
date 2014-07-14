---
layout: api
title: FilteringStream
---
[stdlib](../../index.md) / [kotlin](../index.md) / [FilteringStream](index.md)

# FilteringStream

```
public class FilteringStream<T> 
```

## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|&nbsp;&nbsp;**`public FilteringStream<T> (stream: Stream<T>, sendWhen: Boolean, predicate: (T)->Boolean)`**<br>|
|[iterator](iterator.md)|&nbsp;&nbsp;**`open public fun iterator(): Iterator<T>`**<br>|
|[predicate](predicate.md)|&nbsp;&nbsp;**`val predicate: (T)->Boolean`**<br>|
|[sendWhen](sendWhen.md)|&nbsp;&nbsp;**`val sendWhen: Boolean`**<br>|
|[stream](stream.md)|&nbsp;&nbsp;**`val stream: Stream<T>`**<br>|
