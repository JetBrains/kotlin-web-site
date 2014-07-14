---
layout: api
title: MutableList
---
[stdlib](../../index.html) / [kotlin](../index.html) / [MutableList](index.html)

# MutableList

```
abstract public trait MutableList<E> 
```
## Members
| Name | Summary |
|------|---------|
|[add](add.html)|&nbsp;&nbsp;`abstract public fun add(e: E): Boolean`<br>&nbsp;&nbsp;`abstract public fun add(index: Int, element: E): Unit`<br>|
|[addAll](addAll.html)|&nbsp;&nbsp;`abstract public fun addAll(c: Collection<E>): Boolean`<br>&nbsp;&nbsp;`abstract public fun addAll(index: Int, c: Collection<E>): Boolean`<br>|
|[clear](clear.html)|&nbsp;&nbsp;`abstract public fun clear(): Unit`<br>|
|[listIterator](listIterator.html)|&nbsp;&nbsp;`abstract public fun listIterator(): MutableListIterator<E>`<br>&nbsp;&nbsp;`abstract public fun listIterator(index: Int): MutableListIterator<E>`<br>|
|[remove](remove.html)|&nbsp;&nbsp;`abstract public fun remove(index: Int): E`<br>&nbsp;&nbsp;`abstract public fun remove(o: Any): Boolean`<br>|
|[removeAll](removeAll.html)|&nbsp;&nbsp;`abstract public fun removeAll(c: Collection<Any>): Boolean`<br>|
|[retainAll](retainAll.html)|&nbsp;&nbsp;`abstract public fun retainAll(c: Collection<Any>): Boolean`<br>|
|[set](set.html)|&nbsp;&nbsp;`abstract public fun set(index: Int, element: E): E`<br>|
|[subList](subList.html)|&nbsp;&nbsp;`abstract public fun subList(fromIndex: Int, toIndex: Int): MutableList<E>`<br>|
