---
layout: api
title: toMap
---
[stdlib](../index.html) / [kotlin](index.html) / [toMap](toMap.html)

# toMap
Copies the entries from given iterable of pairs to the given mutable *map*
```
public fun <K, V, C : C> Iterable<Pair<K, V>>.toMap(map: C): C
```
Creates map from given iterable of pairs
```
public fun <K, V> Iterable<Pair<K, V>>.toMap(): Map<K, V>
```
Copies the entries in this [[Map]] to the given mutable *map*
```
public fun <K, V, C : C> Map<K, V>.toMap(map: C): C
```
