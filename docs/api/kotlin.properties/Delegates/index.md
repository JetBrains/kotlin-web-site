---
layout: api
title: Delegates
---
[stdlib](../../index.html) / [kotlin.properties](../index.html) / [Delegates](index.html)

# Delegates

```
public object Delegates
```
## Members
| Name | Summary |
|------|---------|
|[blockingLazy](blockingLazy.html)|&nbsp;&nbsp;`public fun <T> blockingLazy(lock: Any, initializer: ()->T): ReadOnlyProperty<Any, T>`<br>|
|[lazy](lazy.html)|&nbsp;&nbsp;`public fun <T> lazy(initializer: ()->T): ReadOnlyProperty<Any, T>`<br>|
|[mapVal](mapVal.html)|&nbsp;&nbsp;`public fun <T> mapVal(map: Map<String, Any>, default: (Any, String)->T): ReadOnlyProperty<Any, T>`<br>|
|[mapVar](mapVar.html)|&nbsp;&nbsp;`public fun <T> mapVar(map: MutableMap<String, Any>, default: (Any, String)->T): ReadWriteProperty<Any, T>`<br>|
|[notNull](notNull.html)|&nbsp;&nbsp;`public fun <T : T> notNull(): ReadWriteProperty<Any, T>`<br>|
|[observable](observable.html)|&nbsp;&nbsp;`public fun <T> observable(initial: T, onChange: (PropertyMetadata, T, T)->Unit): ReadWriteProperty<Any, T>`<br>|
|[vetoable](vetoable.html)|&nbsp;&nbsp;`public fun <T> vetoable(initial: T, onChange: (PropertyMetadata, T, T)->Boolean): ReadWriteProperty<Any, T>`<br>|
