---
layout: api
title: reduceRight
---
[stdlib](../index.md) / [kotlin](index.md) / [reduceRight](reduceRight.md)

# reduceRight
Accumulates value starting with last element and applying *operation* from right to left to each element and current accumulator value
```
public fun IntArray.reduceRight(operation: (Int, Int)->Int): Int
public fun DoubleArray.reduceRight(operation: (Double, Double)->Double): Double
public fun CharArray.reduceRight(operation: (Char, Char)->Char): Char
public fun ByteArray.reduceRight(operation: (Byte, Byte)->Byte): Byte
public fun <T> Array<T>.reduceRight(operation: (T, T)->T): T
public fun <T> List<T>.reduceRight(operation: (T, T)->T): T
public fun LongArray.reduceRight(operation: (Long, Long)->Long): Long
public fun String.reduceRight(operation: (Char, Char)->Char): Char
public fun ShortArray.reduceRight(operation: (Short, Short)->Short): Short
public fun FloatArray.reduceRight(operation: (Float, Float)->Float): Float
public fun BooleanArray.reduceRight(operation: (Boolean, Boolean)->Boolean): Boolean
```
