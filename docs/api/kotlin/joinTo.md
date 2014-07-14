---
layout: api
title: joinTo
---
[stdlib](../index.md) / [kotlin](index.md) / [joinTo](joinTo.md)

# joinTo
Appends the string from all the elements separated using the *separator* and using the given *prefix* and *postfix* if supplied
```
public fun <A : A> CharArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
public fun <A : A> ByteArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
public fun <T, A : A> Iterable<T>.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
public fun <A : A> BooleanArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
public fun <T, A : A> Array<T>.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
public fun <A : A> IntArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
public fun <A : A> ShortArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
public fun <A : A> LongArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
public fun <A : A> DoubleArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
public fun <A : A> FloatArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
public fun <T, A : A> Stream<T>.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
```
## Description
```
public fun <A : A> CharArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "...")

```
public fun <A : A> ByteArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "...")

```
public fun <T, A : A> Iterable<T>.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "...")

```
public fun <A : A> BooleanArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "...")

```
public fun <T, A : A> Array<T>.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "...")

```
public fun <A : A> IntArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "...")

```
public fun <A : A> ShortArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "...")

```
public fun <A : A> LongArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "...")

```
public fun <A : A> DoubleArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "...")

```
public fun <A : A> FloatArray.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "...")

```
public fun <T, A : A> Stream<T>.joinTo(buffer: A, separator: String, prefix: String, postfix: String, limit: Int, truncated: String): A
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "...")

