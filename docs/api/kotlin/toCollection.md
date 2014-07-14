---
layout: api
title: toCollection
---
[stdlib](../index.html) / [kotlin](index.html) / [toCollection](toCollection.html)

# toCollection
Appends all elements to the given *collection*
```
public fun <T, C : C> Array<T>.toCollection(collection: C): C
public fun <T, C : C> Stream<T>.toCollection(collection: C): C
public fun <T, C : C> Iterable<T>.toCollection(collection: C): C
public fun <C : C> IntArray.toCollection(collection: C): C
public fun <C : C> LongArray.toCollection(collection: C): C
public fun <C : C> ByteArray.toCollection(collection: C): C
public fun <C : C> FloatArray.toCollection(collection: C): C
public fun <C : C> ShortArray.toCollection(collection: C): C
public fun <C : C> BooleanArray.toCollection(collection: C): C
public fun <C : C> String.toCollection(collection: C): C
public fun <C : C> CharArray.toCollection(collection: C): C
public fun <C : C> DoubleArray.toCollection(collection: C): C
```
Copies all characters into a [[Collection]
```
public fun String.toCollection(): Collection<Char>
```
Copies all elements into the given collection
```
public fun <T, C : C> Iterator<T>.toCollection(result: C): C
```
