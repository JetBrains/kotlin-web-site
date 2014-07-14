---
layout: api
title: vetoable
---
[stdlib](../../index.md) / [kotlin.properties](../index.md) / [Delegates](index.md) / [vetoable](vetoable.md)

# vetoable

```
public fun <T> vetoable(initial: T, onChange: (PropertyMetadata, T, T)->Boolean): ReadWriteProperty<Any, T>
```
