---
layout: api
title: MutableList
---
[stdlib](../../index.md) / [kotlin](../index.md) / [MutableList](index.md)

# MutableList

```
abstract public trait MutableList<E> 
```

## Members

| Name | Summary |
|------|---------|
|[add](add.md)|&nbsp;&nbsp;**`abstract public fun add(e: E): Boolean`**<br>&nbsp;&nbsp;**`abstract public fun add(index: Int, element: E): Unit`**<br>|
|[addAll](addAll.md)|&nbsp;&nbsp;**`abstract public fun addAll(c: Collection<E>): Boolean`**<br>&nbsp;&nbsp;**`abstract public fun addAll(index: Int, c: Collection<E>): Boolean`**<br>|
|[clear](clear.md)|&nbsp;&nbsp;**`abstract public fun clear(): Unit`**<br>|
|[listIterator](listIterator.md)|&nbsp;&nbsp;**`abstract public fun listIterator(): MutableListIterator<E>`**<br>&nbsp;&nbsp;**`abstract public fun listIterator(index: Int): MutableListIterator<E>`**<br>|
|[remove](remove.md)|&nbsp;&nbsp;**`abstract public fun remove(index: Int): E`**<br>&nbsp;&nbsp;**`abstract public fun remove(o: Any): Boolean`**<br>|
|[removeAll](removeAll.md)|&nbsp;&nbsp;**`abstract public fun removeAll(c: Collection<Any>): Boolean`**<br>|
|[retainAll](retainAll.md)|&nbsp;&nbsp;**`abstract public fun retainAll(c: Collection<Any>): Boolean`**<br>|
|[set](set.md)|&nbsp;&nbsp;**`abstract public fun set(index: Int, element: E): E`**<br>|
|[subList](subList.md)|&nbsp;&nbsp;**`abstract public fun subList(fromIndex: Int, toIndex: Int): MutableList<E>`**<br>|
