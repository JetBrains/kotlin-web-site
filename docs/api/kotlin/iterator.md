---
layout: api
title: iterator
---
[stdlib](../index.md) / [kotlin](index.md) / [iterator](iterator.md)

# iterator
Returns an [[Iterator]] over the entries in the [[Map]]
```
public fun <K, V> Map<K, V>.iterator(): Iterator<Entry<K, V>>
```
Helper to make java.util.Enumeration usable in for
```
public fun <T> Enumeration<T>.iterator(): Iterator<T>
```
Iterator for characters of given CharSequence
```
public fun CharSequence.iterator(): CharIterator
```
Returns the given iterator itself. This allows to use an instance of iterator in a ranged for-loop
```
public fun <T> Iterator<T>.iterator(): Iterator<T>
```
## Description
```
public fun <K, V> Map<K, V>.iterator(): Iterator<Entry<K, V>>
```
@includeFunctionBody ../../test/collections/MapTest.kt iterateWithProperties

