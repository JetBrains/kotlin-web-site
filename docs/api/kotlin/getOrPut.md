---
layout: api
title: getOrPut
---
[stdlib](../index.md) / [kotlin](index.md) / [getOrPut](getOrPut.md)

# getOrPut
Returns the value for the given key or the result of the defaultValue function is put into the map for the given value and returned
```
public fun <K, V> MutableMap<K, V>.getOrPut(key: K, defaultValue: ()->V): V
```
## Description
```
public fun <K, V> MutableMap<K, V>.getOrPut(key: K, defaultValue: ()->V): V
```
@includeFunctionBody ../../test/collections/MapTest.kt getOrPut

