---
layout: api
title: getOrElse
---
[stdlib](../index.md) / [kotlin](index.md) / [getOrElse](getOrElse.md)

# getOrElse
Returns the value for the given key or returns the result of the defaultValue function if there was no entry for the given key
```
public fun <K, V> Map<K, V>.getOrElse(key: K, defaultValue: ()->V): V
```
## Description
```
public fun <K, V> Map<K, V>.getOrElse(key: K, defaultValue: ()->V): V
```
@includeFunctionBody ../../test/collections/MapTest.kt getOrElse

