---
layout: api
title: BlockingLazyVal
---
[stdlib](../../index.html) / [kotlin.properties](../index.html) / [BlockingLazyVal](index.html)

# BlockingLazyVal

```
private class BlockingLazyVal<T> 
```
## Members
| Name | Summary |
|------|---------|
|[*.init*](_init_.html)|&nbsp;&nbsp;`public BlockingLazyVal<T> (lock: Any, initializer: ()->T)`<br>|
|[get](get.html)|&nbsp;&nbsp;`open public fun get(thisRef: Any, desc: PropertyMetadata): T`<br>|
|[initializer](initializer.html)|&nbsp;&nbsp;`private val initializer: ()->T`<br>|
|[lock](lock.html)|&nbsp;&nbsp;`private val lock: Any`<br>|
|[value](value.html)|&nbsp;&nbsp;`private val value: Any`<br>|
