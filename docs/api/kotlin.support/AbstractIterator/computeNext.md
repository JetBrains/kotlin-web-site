---
layout: api
title: computeNext
---
[stdlib](../../index.md) / [kotlin.support](../index.md) / [AbstractIterator](index.md) / [computeNext](computeNext.md)

# computeNext
Computes the next item in the iterator.
```
abstract protected fun computeNext(): Unit
```
## Description
```
abstract protected fun computeNext(): Unit
```
This callback method should call one of these two methods
* [[setNext(T)]] with the next value of the iteration
* [[done()]] to indicate there are no more elements
Failure to call either method will result in the iteration terminating with a failed state

