---
layout: api
title: joinToString
---
[stdlib](../index.md) / [kotlin](index.md) / [joinToString](joinToString.md)

# joinToString
Creates a string from all the elements separated using the *separator* and using the given *prefix* and *postfix* if supplied.
```
public fun <T> Iterable<T>.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun FloatArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun IntArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun CharArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun LongArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun BooleanArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun ByteArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun ShortArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun DoubleArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun <T> Array<T>.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun <T> Stream<T>.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
## Description
```
public fun <T> Iterable<T>.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "..."

```
public fun FloatArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "..."

```
public fun IntArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "..."

```
public fun CharArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "..."

```
public fun LongArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "..."

```
public fun BooleanArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "..."

```
public fun ByteArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "..."

```
public fun ShortArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "..."

```
public fun DoubleArray.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "..."

```
public fun <T> Array<T>.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "..."

```
public fun <T> Stream<T>.joinToString(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "..."

