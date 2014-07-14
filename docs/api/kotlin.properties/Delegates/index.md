---
layout: api
title: Delegates
---
[stdlib](../../index.md) / [kotlin.properties](../index.md) / [Delegates](index.md)

# Delegates

```
public object Delegates
```

## Members

| Name | Summary |
|------|---------|
|[blockingLazy](blockingLazy.md)|&nbsp;&nbsp;**`public fun <T> blockingLazy(lock: Any, initializer: ()->T): ReadOnlyProperty<Any, T>`**<br>|
|[lazy](lazy.md)|&nbsp;&nbsp;**`public fun <T> lazy(initializer: ()->T): ReadOnlyProperty<Any, T>`**<br>|
|[mapVal](mapVal.md)|&nbsp;&nbsp;**`public fun <T> mapVal(map: Map<String, Any>, default: (Any, String)->T): ReadOnlyProperty<Any, T>`**<br>|
|[mapVar](mapVar.md)|&nbsp;&nbsp;**`public fun <T> mapVar(map: MutableMap<String, Any>, default: (Any, String)->T): ReadWriteProperty<Any, T>`**<br>|
|[notNull](notNull.md)|&nbsp;&nbsp;**`public fun <T : T> notNull(): ReadWriteProperty<Any, T>`**<br>|
|[observable](observable.md)|&nbsp;&nbsp;**`public fun <T> observable(initial: T, onChange: (PropertyMetadata, T, T)->Unit): ReadWriteProperty<Any, T>`**<br>|
|[vetoable](vetoable.md)|&nbsp;&nbsp;**`public fun <T> vetoable(initial: T, onChange: (PropertyMetadata, T, T)->Boolean): ReadWriteProperty<Any, T>`**<br>|
