---
layout: api
title: AbstractIterator
---
[stdlib](../../index.md) / [kotlin.support](../index.md) / [AbstractIterator](index.md)

# AbstractIterator
A base class to simplify implementing iterators so that implementations only have to implement [[computeNext()]]
```
abstract public class AbstractIterator<T> 
```
## Description
```
abstract public class AbstractIterator<T> 
```
to implement the iterator, calling [[done()]] when the iteration is complete.


## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|A base class to simplify implementing iterators so that implementations only have to implement [[computeNext()]]<br>&nbsp;&nbsp;**`public AbstractIterator<T> ()`**<br>|
|[computeNext](computeNext.md)|Computes the next item in the iterator.<br>&nbsp;&nbsp;**`abstract protected fun computeNext(): Unit`**<br>|
|[done](done.md)|Sets the state to done so that the iteration terminates<br>&nbsp;&nbsp;**`protected fun done(): Unit`**<br>|
|[hasNext](hasNext.md)|&nbsp;&nbsp;**`open public fun hasNext(): Boolean`**<br>|
|[next](next.md)|&nbsp;&nbsp;**`open public fun next(): T`**<br>|
|[nextValue](nextValue.md)|&nbsp;&nbsp;**`private val nextValue: T`**<br>|
|[peek](peek.md)|Returns the next element in the iteration without advancing the iteration<br>&nbsp;&nbsp;**`fun peek(): T`**<br>|
|[setNext](setNext.md)|Sets the next value in the iteration, called from the [[computeNext()]] function<br>&nbsp;&nbsp;**`protected fun setNext(value: T): Unit`**<br>|
|[state](state.md)|&nbsp;&nbsp;**`private val state: Int`**<br>|
|[tryToComputeNext](tryToComputeNext.md)|&nbsp;&nbsp;**`private fun tryToComputeNext(): Boolean`**<br>|
