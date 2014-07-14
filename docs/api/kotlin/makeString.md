---
layout: api
title: makeString
---
[stdlib](../index.md) / [kotlin](index.md) / [makeString](makeString.md)

# makeString

```
public fun BooleanArray.makeString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun DoubleArray.makeString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun LongArray.makeString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun FloatArray.makeString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun <T> Stream<T>.makeString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun ShortArray.makeString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun <T> Array<T>.makeString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun CharArray.makeString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun ByteArray.makeString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun IntArray.makeString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun <T> Iterable<T>.makeString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
Creates a string from all the elements separated using the *separator* and using the given *prefix* and *postfix* if supplied.
```
public fun <T> Iterator<T>.makeString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
## Description
```
public fun <T> Iterator<T>.makeString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "..."

