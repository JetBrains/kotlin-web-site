---
layout: api
title: foldRight
---
[stdlib](../index.md) / [kotlin](index.md) / [foldRight](foldRight.md)

# foldRight
Accumulates value starting with *initial* value and applying *operation* from right to left to each element and current accumulator value
```
public fun <R> LongArray.foldRight(initial: R, operation: (Long, R)->R): R
public fun <R> String.foldRight(initial: R, operation: (Char, R)->R): R
public fun <R> ShortArray.foldRight(initial: R, operation: (Short, R)->R): R
public fun <R> CharArray.foldRight(initial: R, operation: (Char, R)->R): R
public fun <R> FloatArray.foldRight(initial: R, operation: (Float, R)->R): R
public fun <R> DoubleArray.foldRight(initial: R, operation: (Double, R)->R): R
public fun <T, R> List<T>.foldRight(initial: R, operation: (T, R)->R): R
public fun <T, R> Array<T>.foldRight(initial: R, operation: (T, R)->R): R
public fun <R> ByteArray.foldRight(initial: R, operation: (Byte, R)->R): R
public fun <R> IntArray.foldRight(initial: R, operation: (Int, R)->R): R
public fun <R> BooleanArray.foldRight(initial: R, operation: (Boolean, R)->R): R
```
