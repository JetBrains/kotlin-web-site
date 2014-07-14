---
layout: api
title: FixedMapVal
---
[stdlib](../../index.md) / [kotlin.properties](../index.md) / [FixedMapVal](index.md)

# FixedMapVal

```
open public class FixedMapVal<T, K, V> 
```

## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|&nbsp;&nbsp;**`public FixedMapVal<T, K, V> (map: Map<K, Any>, key: (PropertyMetadata)->K, default: (T, K)->V)`**<br>|
|[default](default.md)|&nbsp;&nbsp;**`private val default: (T, K)->V`**<br>&nbsp;&nbsp;**`open protected fun default(ref: T, desc: PropertyMetadata): V`**<br>|
|[key](key.md)|&nbsp;&nbsp;**`private val key: (PropertyMetadata)->K`**<br>&nbsp;&nbsp;**`open protected fun key(desc: PropertyMetadata): K`**<br>|
|[map](map.md)|&nbsp;&nbsp;**`private val map: Map<K, Any>`**<br>&nbsp;&nbsp;**`open protected fun map(ref: T): Map<K, Any>`**<br>|
