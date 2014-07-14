---
layout: api
title: toSortedMap
---
[stdlib](../index.html) / [kotlin](index.html) / [toSortedMap](toSortedMap.html)

# toSortedMap
Converts this [[Map]] to a [[SortedMap]] using the given *comparator* so that iteration order will be in the order
```
public fun <K, V> Map<K, V>.toSortedMap(comparator: Comparator<K>): SortedMap<K, V>
```
Converts this [[Map]] to a [[SortedMap]] so iteration order will be in key order
```
public fun <K, V> Map<K, V>.toSortedMap(): SortedMap<K, V>
```
## Description
```
public fun <K, V> Map<K, V>.toSortedMap(comparator: Comparator<K>): SortedMap<K, V>
```
defined by the comparator
@includeFunctionBody ../../test/collections/MapTest.kt toSortedMapWithComparator

```
public fun <K, V> Map<K, V>.toSortedMap(): SortedMap<K, V>
```
@includeFunctionBody ../../test/collections/MapTest.kt toSortedMap

