---
layout: api
title: FunctionIterator
---
[stdlib](../../index.md) / [kotlin](../index.md) / [FunctionIterator](index.md)

# FunctionIterator
An [[Iterator]] which invokes a function to calculate the next value in the iteration until the function returns *null*
```
class FunctionIterator<T : T> 
```

## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|An [[Iterator]] which invokes a function to calculate the next value in the iteration until the function returns *null*<br>&nbsp;&nbsp;**`public FunctionIterator<T : T> (nextFunction: ()->T)`**<br>|
|[computeNext](computeNext.md)|&nbsp;&nbsp;**`open protected fun computeNext(): Unit`**<br>|
|[nextFunction](nextFunction.md)|&nbsp;&nbsp;**`val nextFunction: ()->T`**<br>|
