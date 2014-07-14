---
layout: api
title: mapValues
---
[stdlib](../index.html) / [kotlin](index.html) / [mapValues](mapValues.html)

# mapValues
Returns a new Map containing the results of applying the given *transform* function to each [[Map.Entry]] in this [[Map]]
```
public fun <K, V, R> Map<K, V>.mapValues(transform: (Entry<K, V>)->R): Map<K, R>
```
## Description
```
public fun <K, V, R> Map<K, V>.mapValues(transform: (Entry<K, V>)->R): Map<K, R>
```
@includeFunctionBody ../../test/collections/MapTest.kt mapValues

