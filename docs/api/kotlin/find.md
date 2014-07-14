---
layout: api
title: find
---
[stdlib](../index.html) / [kotlin](index.html) / [find](find.html)

# find

```
public fun <T> Array<T>.find(predicate: (T)->Boolean): T
public fun <T> Iterable<T>.find(predicate: (T)->Boolean): T
```
Returns the first character which matches the given *predicate* or *null* if none matched
```
public fun String.find(predicate: (Char)->Boolean): Char
```
Returns the first element which matches the given *predicate* or *null* if none matched
```
public fun <T : T> Iterator<T>.find(predicate: (T)->Boolean): T
```
## Description
```
public fun String.find(predicate: (Char)->Boolean): Char
```
@includeFunctionBody ../../test/text/StringTest.kt find

