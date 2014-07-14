---
layout: api
title: dropWhileTo
---
[stdlib](../index.html) / [kotlin](index.html) / [dropWhileTo](dropWhileTo.html)

# dropWhileTo
Returns a list containing the everything but the first elements that satisfy the given *predicate*
```
public fun <T, L : L> Iterator<T>.dropWhileTo(result: L, predicate: (T)->Boolean): L
```
Returns an Appendable containing the everything but the first characters that satisfy the given *predicate*
```
public fun <T : T> String.dropWhileTo(result: T, predicate: (Char)->Boolean): T
```
## Description
```
public fun <T : T> String.dropWhileTo(result: T, predicate: (Char)->Boolean): T
```
@includeFunctionBody ../../test/text/StringTest.kt dropWhile

