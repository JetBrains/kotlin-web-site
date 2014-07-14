---
layout: api
title: MapVal
---
[stdlib](../../index.html) / [kotlin.properties](../index.html) / [MapVal](index.html)

# MapVal

```
abstract public class MapVal<T, K, V> 
```
## Members
| Name | Summary |
|------|---------|
|[*.init*](_init_.html)|&nbsp;&nbsp;`public MapVal<T, K, V> ()`<br>|
|[default](default.html)|&nbsp;&nbsp;`open protected fun default(ref: T, desc: PropertyMetadata): V`<br>|
|[get](get.html)|&nbsp;&nbsp;`open public fun get(thisRef: T, desc: PropertyMetadata): V`<br>|
|[key](key.html)|&nbsp;&nbsp;`abstract protected fun key(desc: PropertyMetadata): K`<br>|
|[map](map.html)|&nbsp;&nbsp;`abstract protected fun map(ref: T): Map<K, Any>`<br>|
