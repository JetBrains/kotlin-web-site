---
layout: api
title: toLinkedList
---
[stdlib](../index.md) / [kotlin](index.md) / [toLinkedList](toLinkedList.md)

# toLinkedList
Returns a LinkedList containing all elements
```
public fun FloatArray.toLinkedList(): LinkedList<Float>
public fun LongArray.toLinkedList(): LinkedList<Long>
public fun IntArray.toLinkedList(): LinkedList<Int>
public fun String.toLinkedList(): LinkedList<Char>
public fun ByteArray.toLinkedList(): LinkedList<Byte>
public fun <T> Iterable<T>.toLinkedList(): LinkedList<T>
public fun BooleanArray.toLinkedList(): LinkedList<Boolean>
public fun <T> Stream<T>.toLinkedList(): LinkedList<T>
public fun DoubleArray.toLinkedList(): LinkedList<Double>
public fun ShortArray.toLinkedList(): LinkedList<Short>
public fun CharArray.toLinkedList(): LinkedList<Char>
public fun <T> Array<T>.toLinkedList(): LinkedList<T>
```
Copies all elements into a [[LinkedList]]
```
public fun <T> Iterator<T>.toLinkedList(): LinkedList<T>
```
