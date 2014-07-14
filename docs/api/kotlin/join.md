---
layout: api
title: join
---
[stdlib](../index.html) / [kotlin](index.html) / [join](join.html)

# join
Creates a string from all the elements separated using the *separator* and using the given *prefix* and *postfix* if supplied.
```
public fun Stream<String>.join(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun Array<String>.join(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
public fun Iterable<String>.join(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
## Description
```
public fun Stream<String>.join(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a stream could be huge you can specify a non-negative value of *limit* which will only show a subset of the stream then it will
a special *truncated* separator (which defaults to "...")

```
public fun Array<String>.join(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If an array could be huge you can specify a non-negative value of *limit* which will only show a subset of the array then it will
a special *truncated* separator (which defaults to "...")

```
public fun Iterable<String>.join(separator: String, prefix: String, postfix: String, limit: Int, truncated: String): String
```
If a collection could be huge you can specify a non-negative value of *limit* which will only show a subset of the collection then it will
a special *truncated* separator (which defaults to "...")

