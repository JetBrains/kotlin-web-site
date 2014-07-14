---
layout: api
title: plus
---
[stdlib](../index.html) / [kotlin](index.html) / [plus](plus.html)

# plus
Returns a list containing all elements of original collection and then all elements of the given *collection*
```
public fun ShortArray.plus(array: Array<Short>): List<Short>
public fun IntArray.plus(array: Array<Int>): List<Int>
public fun <T> Array<T>.plus(collection: Iterable<T>): List<T>
public fun <T> Iterable<T>.plus(collection: Iterable<T>): List<T>
public fun BooleanArray.plus(array: Array<Boolean>): List<Boolean>
public fun <T> Iterable<T>.plus(array: Array<T>): List<T>
public fun IntArray.plus(collection: Iterable<Int>): List<Int>
public fun ByteArray.plus(array: Array<Byte>): List<Byte>
public fun DoubleArray.plus(array: Array<Double>): List<Double>
public fun DoubleArray.plus(collection: Iterable<Double>): List<Double>
public fun LongArray.plus(collection: Iterable<Long>): List<Long>
public fun BooleanArray.plus(collection: Iterable<Boolean>): List<Boolean>
public fun FloatArray.plus(collection: Iterable<Float>): List<Float>
public fun FloatArray.plus(array: Array<Float>): List<Float>
public fun CharArray.plus(collection: Iterable<Char>): List<Char>
public fun ByteArray.plus(collection: Iterable<Byte>): List<Byte>
public fun ShortArray.plus(collection: Iterable<Short>): List<Short>
public fun LongArray.plus(array: Array<Long>): List<Long>
public fun CharArray.plus(array: Array<Char>): List<Char>
public fun <T> Array<T>.plus(array: Array<T>): List<T>
```
Returns a list containing all elements of original collection and then the given element
```
public fun ShortArray.plus(element: Short): List<Short>
public fun ByteArray.plus(element: Byte): List<Byte>
public fun LongArray.plus(element: Long): List<Long>
public fun BooleanArray.plus(element: Boolean): List<Boolean>
public fun IntArray.plus(element: Int): List<Int>
public fun FloatArray.plus(element: Float): List<Float>
public fun <T> Array<T>.plus(element: T): List<T>
public fun CharArray.plus(element: Char): List<Char>
public fun <T> Iterable<T>.plus(element: T): List<T>
public fun DoubleArray.plus(element: Double): List<Double>
```

```
public fun String.plus(other: Any): String
```
Returns a stream containing all elements of original stream and then all elements of the given *collection*
```
public fun <T> Stream<T>.plus(collection: Iterable<T>): Stream<T>
```
Creates an [[Iterator]] which iterates over this iterator then the following iterator
```
public fun <T> Iterator<T>.plus(iterator: Iterator<T>): Iterator<T>
```
Concatenates this Char and a String
```
public fun Char.plus(string: String): String
```
Returns a stream containing all elements of original stream and then the given element
```
public fun <T> Stream<T>.plus(element: T): Stream<T>
```
Creates an [[Iterator]] which iterates over this iterator then the given element at the end
```
public fun <T> Iterator<T>.plus(element: T): Iterator<T>
```
Creates an [[Iterator]] which iterates over this iterator then the following collection
```
public fun <T> Iterator<T>.plus(collection: Iterable<T>): Iterator<T>
```
Returns a stream containing all elements of original stream and then all elements of the given *stream*
```
public fun <T> Stream<T>.plus(stream: Stream<T>): Stream<T>
```
