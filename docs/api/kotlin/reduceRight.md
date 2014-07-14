---
layout: api
title: reduceRight
---
[stdlib](../index.html) / [kotlin](index.html) / [reduceRight](reduceRight.html)

# reduceRight
Accumulates value starting with last element and applying *operation* from right to left to each element and current accumulator value
```
public fun <T> Array<T>.reduceRight(operation: (T, T)->T): T
public fun LongArray.reduceRight(operation: (Long, Long)->Long): Long
public fun String.reduceRight(operation: (Char, Char)->Char): Char
public fun IntArray.reduceRight(operation: (Int, Int)->Int): Int
public fun ShortArray.reduceRight(operation: (Short, Short)->Short): Short
public fun ByteArray.reduceRight(operation: (Byte, Byte)->Byte): Byte
public fun DoubleArray.reduceRight(operation: (Double, Double)->Double): Double
public fun FloatArray.reduceRight(operation: (Float, Float)->Float): Float
public fun <T> List<T>.reduceRight(operation: (T, T)->T): T
public fun CharArray.reduceRight(operation: (Char, Char)->Char): Char
public fun BooleanArray.reduceRight(operation: (Boolean, Boolean)->Boolean): Boolean
```
