---
layout: api
title: MapVal
---
[stdlib](../../index.md) / [kotlin.properties](../index.md) / [MapVal](index.md)

# MapVal

```
abstract public class MapVal<T, K, V> 
```

## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|&nbsp;&nbsp;**`public MapVal<T, K, V> ()`**<br>|
|[default](default.md)|&nbsp;&nbsp;**`open protected fun default(ref: T, desc: PropertyMetadata): V`**<br>|
|[get](get.md)|&nbsp;&nbsp;**`open public fun get(thisRef: T, desc: PropertyMetadata): V`**<br>|
|[key](key.md)|&nbsp;&nbsp;**`abstract protected fun key(desc: PropertyMetadata): K`**<br>|
|[map](map.md)|&nbsp;&nbsp;**`abstract protected fun map(ref: T): Map<K, Any>`**<br>|
