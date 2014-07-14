---
layout: api
title: fold
---
[stdlib](../index.html) / [kotlin](index.html) / [fold](fold.html)

# fold
Accumulates value starting with *initial* value and applying *operation* from left to right to current accumulator value and each element
```
public fun <R> FloatArray.fold(initial: R, operation: (R, Float)->R): R
public fun <R> ShortArray.fold(initial: R, operation: (R, Short)->R): R
public fun <R> CharArray.fold(initial: R, operation: (R, Char)->R): R
public fun <T, R> Iterable<T>.fold(initial: R, operation: (R, T)->R): R
public fun <R> String.fold(initial: R, operation: (R, Char)->R): R
public fun <T, R> Array<T>.fold(initial: R, operation: (R, T)->R): R
public fun <R> LongArray.fold(initial: R, operation: (R, Long)->R): R
public fun <R> DoubleArray.fold(initial: R, operation: (R, Double)->R): R
public fun <R> BooleanArray.fold(initial: R, operation: (R, Boolean)->R): R
public fun <T, R> Stream<T>.fold(initial: R, operation: (R, T)->R): R
public fun <R> ByteArray.fold(initial: R, operation: (R, Byte)->R): R
public fun <R> IntArray.fold(initial: R, operation: (R, Int)->R): R
```
Folds all elements from from left to right with the *initial* value to perform the operation on sequential pairs of elements
```
public fun <T, R> Iterator<T>.fold(initial: R, operation: (R, T)->R): R
```
