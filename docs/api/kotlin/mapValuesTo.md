---
layout: api
title: mapValuesTo
---
[stdlib](../index.md) / [kotlin](index.md) / [mapValuesTo](mapValuesTo.md)

# mapValuesTo
Populates the given *result* [[Map]] with the value returned by applying the *transform* function on each [[Map.Entry]] in this [[Map]]
```
public fun <K, V, R, C : C> Map<K, V>.mapValuesTo(result: C, transform: (Entry<K, V>)->R): C
```
