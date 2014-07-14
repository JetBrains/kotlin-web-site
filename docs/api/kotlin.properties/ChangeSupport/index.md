---
layout: api
title: ChangeSupport
---
[stdlib](../../index.html) / [kotlin.properties](../index.html) / [ChangeSupport](index.html)

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
|[*.init*](_init_.html)|Represents an object where properties can be listened to and notified on<br>&nbsp;&nbsp;`public ChangeSupport()`<br>|
|[addChangeListener](addChangeListener.html)|&nbsp;&nbsp;`public fun addChangeListener(listener: ChangeListener): Unit`<br>&nbsp;&nbsp;`public fun addChangeListener(name: String, listener: ChangeListener): Unit`<br>|
|[allListeners](allListeners.html)|&nbsp;&nbsp;`private val allListeners: MutableList<ChangeListener>`<br>|
|[changeProperty](changeProperty.html)|&nbsp;&nbsp;`protected fun <T> changeProperty(name: String, oldValue: T, newValue: T): Unit`<br>|
|[firePropertyChanged](firePropertyChanged.html)|&nbsp;&nbsp;`protected fun firePropertyChanged(event: ChangeEvent): Unit`<br>|
|[nameListeners](nameListeners.html)|&nbsp;&nbsp;`private val nameListeners: MutableMap<String, MutableList<ChangeListener>>`<br>|
|[onPropertyChange](onPropertyChange.html)|&nbsp;&nbsp;`public fun onPropertyChange(fn: (ChangeEvent)->Unit): Unit`<br>&nbsp;&nbsp;`public fun onPropertyChange(name: String, fn: (ChangeEvent)->Unit): Unit`<br>|
|[property](property.html)|&nbsp;&nbsp;`protected fun <T> property(init: T): ReadWriteProperty<Any, T>`<br>|
