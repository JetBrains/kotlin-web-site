---
layout: api
title: BlockingLazyVal
---
[stdlib](../../index.md) / [kotlin.properties](../index.md) / [BlockingLazyVal](index.md)

# BlockingLazyVal

```
private class BlockingLazyVal<T> 
```

## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|&nbsp;&nbsp;**`public BlockingLazyVal<T> (lock: Any, initializer: ()->T)`**<br>|
|[get](get.md)|&nbsp;&nbsp;**`open public fun get(thisRef: Any, desc: PropertyMetadata): T`**<br>|
|[initializer](initializer.md)|&nbsp;&nbsp;**`private val initializer: ()->T`**<br>|
|[lock](lock.md)|&nbsp;&nbsp;**`private val lock: Any`**<br>|
|[value](value.md)|&nbsp;&nbsp;**`private val value: Any`**<br>|
