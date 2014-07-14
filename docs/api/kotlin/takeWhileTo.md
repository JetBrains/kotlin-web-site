---
layout: api
title: takeWhileTo
---
[stdlib](../index.html) / [kotlin](index.html) / [takeWhileTo](takeWhileTo.html)

# takeWhileTo
Returns a list containing the first elements that satisfy the given *predicate*
```
public fun <T, C : C> Iterator<T>.takeWhileTo(result: C, predicate: (T)->Boolean): C
```
Returns an Appendable containing the first characters that satisfy the given *predicate*
```
public fun <T : T> String.takeWhileTo(result: T, predicate: (Char)->Boolean): T
```
## Description
```
public fun <T : T> String.takeWhileTo(result: T, predicate: (Char)->Boolean): T
```
@includeFunctionBody ../../test/text/StringTest.kt takeWhile

