---
layout: api
title: expect
---
[stdlib](../index.md) / [kotlin.test](index.md) / [expect](expect.md)

# expect
Asserts that given function block returns the given expected value and use the given message if it fails
```
public fun <T> expect(expected: T, message: String, block: ()->T): Unit
```
Asserts that given function block returns the given expected value
```
public fun <T> expect(expected: T, block: ()->T): Unit
```
