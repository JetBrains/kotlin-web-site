---
layout: api
title: to
---
[stdlib](../index.html) / [kotlin](index.html) / [to](to.html)

# to
Creates a tuple of type [[Pair<A,B>]] from this and *that* which can be useful for creating [[Map]] literals
```
public fun <A, B> A.to(that: B): Pair<A, B>
```
## Description
```
public fun <A, B> A.to(that: B): Pair<A, B>
```
with less noise, for example
@includeFunctionBody ../../test/collections/MapTest.kt createUsingTo

