---
layout: api
title: expect
---
[stdlib](../index.html) / [kotlin.test](index.html) / [expect](expect.html)

# expect
Asserts that given function block returns the given expected value
```
public fun <T> expect(expected: T, block: ()->T): Unit
```
Asserts that given function block returns the given expected value and use the given message if it fails
```
public fun <T> expect(expected: T, message: String, block: ()->T): Unit
```
