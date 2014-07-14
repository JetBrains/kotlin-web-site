---
layout: api
title: ObservableProperty
---
[stdlib](../../index.html) / [kotlin.properties](../index.html) / [ObservableProperty](index.html)

# ObservableProperty

```
class ObservableProperty<T> 
```
## Members
| Name | Summary |
|------|---------|
|[*.init*](_init_.html)|&nbsp;&nbsp;`public ObservableProperty<T> (initialValue: T, onChange: (PropertyMetadata, T, T)->Boolean)`<br>|
|[get](get.html)|&nbsp;&nbsp;`open public fun get(thisRef: Any, desc: PropertyMetadata): T`<br>|
|[onChange](onChange.html)|&nbsp;&nbsp;`val onChange: (PropertyMetadata, T, T)->Boolean`<br>|
|[set](set.html)|&nbsp;&nbsp;`open public fun set(thisRef: Any, desc: PropertyMetadata, value: T): Unit`<br>|
|[value](value.html)|&nbsp;&nbsp;`private val value: T`<br>|
