---
layout: api
title: first
---
[stdlib](../../index.html) / [kotlin](../index.html) / [first](index.html)

# first
TODO figure out necessary variance/generics ninja stuff... :)
```
val <T> List<T>.first: T
```
## Description
```
val <T> List<T>.first: T
```
public inline fun <in T> List<T>.sort(transform: fun(T) : java.lang.Comparable<*>) : List<T> {
val comparator = java.util.Comparator<T>() {
public fun compare(o1: T, o2: T): Int {
val v1 = transform(o1)
val v2 = transform(o2)
if (v1 == v2) {
return 0
} else {
return v1.compareTo(v2)
}
}
}
answer.sort(comparator)
}
Returns the first item in the list or null if the list is empty
@includeFunctionBody ../../test/collections/ListSpecificTest.kt first

## Members
| Name | Summary |
|------|---------|
|[&lt;get-first&gt;](_get-first_.html)|&nbsp;&nbsp;`fun List<T>.<get-first>(): T`<br>|
