---
layout: api
title: FixedMapVar
---
[stdlib](../../index.md) / [kotlin.properties](../index.md) / [FixedMapVar](index.md)

# FixedMapVar

```
open public class FixedMapVar<T, K, V> 
```

## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|&nbsp;&nbsp;**`public FixedMapVar<T, K, V> (map: MutableMap<K, Any>, key: (PropertyMetadata)->K, default: (T, K)->V)`**<br>|
|[default](default.md)|&nbsp;&nbsp;**`private val default: (T, K)->V`**<br>&nbsp;&nbsp;**`open protected fun default(ref: T, desc: PropertyMetadata): V`**<br>|
|[key](key.md)|&nbsp;&nbsp;**`private val key: (PropertyMetadata)->K`**<br>&nbsp;&nbsp;**`open protected fun key(desc: PropertyMetadata): K`**<br>|
|[map](map.md)|&nbsp;&nbsp;**`private val map: MutableMap<K, Any>`**<br>&nbsp;&nbsp;**`open protected fun map(ref: T): MutableMap<K, Any>`**<br>|
