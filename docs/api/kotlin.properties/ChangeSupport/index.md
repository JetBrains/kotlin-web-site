---
layout: api
title: ChangeSupport
---
[stdlib](../../index.md) / [kotlin.properties](../index.md) / [ChangeSupport](index.md)

# ChangeSupport
Represents an object where properties can be listened to and notified on
```
abstract public class ChangeSupport
```
## Description
```
abstract public class ChangeSupport
```
updates for easier binding to user interfaces, undo/redo command stacks and
change tracking mechanisms for persistence or distributed change notifications.


## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|Represents an object where properties can be listened to and notified on<br>&nbsp;&nbsp;**`public ChangeSupport()`**<br>|
|[addChangeListener](addChangeListener.md)|&nbsp;&nbsp;**`public fun addChangeListener(listener: ChangeListener): Unit`**<br>&nbsp;&nbsp;**`public fun addChangeListener(name: String, listener: ChangeListener): Unit`**<br>|
|[allListeners](allListeners.md)|&nbsp;&nbsp;**`private val allListeners: MutableList<ChangeListener>`**<br>|
|[changeProperty](changeProperty.md)|&nbsp;&nbsp;**`protected fun <T> changeProperty(name: String, oldValue: T, newValue: T): Unit`**<br>|
|[firePropertyChanged](firePropertyChanged.md)|&nbsp;&nbsp;**`protected fun firePropertyChanged(event: ChangeEvent): Unit`**<br>|
|[nameListeners](nameListeners.md)|&nbsp;&nbsp;**`private val nameListeners: MutableMap<String, MutableList<ChangeListener>>`**<br>|
|[onPropertyChange](onPropertyChange.md)|&nbsp;&nbsp;**`public fun onPropertyChange(fn: (ChangeEvent)->Unit): Unit`**<br>&nbsp;&nbsp;**`public fun onPropertyChange(name: String, fn: (ChangeEvent)->Unit): Unit`**<br>|
|[property](property.md)|&nbsp;&nbsp;**`protected fun <T> property(init: T): ReadWriteProperty<Any, T>`**<br>|
