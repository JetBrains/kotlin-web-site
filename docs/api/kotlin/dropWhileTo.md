---
layout: api
title: dropWhileTo
---
[stdlib](../index.md) / [kotlin](index.md) / [dropWhileTo](dropWhileTo.md)

# dropWhileTo
Returns an Appendable containing the everything but the first characters that satisfy the given *predicate*
```
public fun <T : T> String.dropWhileTo(result: T, predicate: (Char)->Boolean): T
```
Returns a list containing the everything but the first elements that satisfy the given *predicate*
```
public fun <T, L : L> Iterator<T>.dropWhileTo(result: L, predicate: (T)->Boolean): L
```
## Description
```
public fun <T : T> String.dropWhileTo(result: T, predicate: (Char)->Boolean): T
```
@includeFunctionBody ../../test/text/StringTest.kt dropWhile

