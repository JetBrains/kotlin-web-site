---
layout: api
title: FilteringStream
---
[stdlib](../../index.html) / [kotlin](../index.html) / [FilteringStream](index.html)

# FilteringStream

```
public class FilteringStream<T> 
```
## Members
| Name | Summary |
|------|---------|
|[*.init*](_init_.html)|&nbsp;&nbsp;`public FilteringStream<T> (stream: Stream<T>, sendWhen: Boolean, predicate: (T)->Boolean)`<br>|
|[iterator](iterator.html)|&nbsp;&nbsp;`open public fun iterator(): Iterator<T>`<br>|
|[predicate](predicate.html)|&nbsp;&nbsp;`val predicate: (T)->Boolean`<br>|
|[sendWhen](sendWhen.html)|&nbsp;&nbsp;`val sendWhen: Boolean`<br>|
|[stream](stream.html)|&nbsp;&nbsp;`val stream: Stream<T>`<br>|
