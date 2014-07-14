---
layout: api
title: getOrElse
---
[stdlib](../index.html) / [kotlin](index.html) / [getOrElse](getOrElse.html)

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

