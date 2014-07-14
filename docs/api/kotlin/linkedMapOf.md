---
layout: api
title: linkedMapOf
---
[stdlib](../index.html) / [kotlin](index.html) / [linkedMapOf](linkedMapOf.html)

# linkedMapOf
Returns a new [[LinkedHashMap]] populated with the given pairs where the first value in each pair
```
public fun <K, V> linkedMapOf(values: Array<Pair<K, V>>): LinkedHashMap<K, V>
```
## Description
```
public fun <K, V> linkedMapOf(values: Array<Pair<K, V>>): LinkedHashMap<K, V>
```
is the key and the second value is the value. This map preserves insertion order so iterating through
the map's entries will be in the same order
@includeFunctionBody ../../test/collections/MapTest.kt createLinkedMap

