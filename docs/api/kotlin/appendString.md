---
layout: api
title: appendString
---
[stdlib](../index.md) / [kotlin](index.md) / [appendString](appendString.md)

# appendString

```
public fun <T> Stream<T>.appendString(buffer: Appendable, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): Unit
public fun IntArray.appendString(buffer: Appendable, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): Unit
public fun FloatArray.appendString(buffer: Appendable, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): Unit
public fun ShortArray.appendString(buffer: Appendable, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): Unit
public fun ByteArray.appendString(buffer: Appendable, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): Unit
public fun LongArray.appendString(buffer: Appendable, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): Unit
public fun BooleanArray.appendString(buffer: Appendable, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): Unit
public fun <T> Array<T>.appendString(buffer: Appendable, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): Unit
public fun DoubleArray.appendString(buffer: Appendable, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): Unit
public fun <T> Iterable<T>.appendString(buffer: Appendable, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): Unit
public fun CharArray.appendString(buffer: Appendable, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): Unit
```
Appends the string from all the elements separated using the *separator* and using the given *prefix* and *postfix* if supplied
```
public fun <T> Iterator<T>.appendString(buffer: Appendable, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): Unit
```
## Description
```
public fun <T> Iterator<T>.appendString(buffer: Appendable, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): Unit
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "..."

