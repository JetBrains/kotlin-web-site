---
layout: api
title: FunctionIterator
---
[stdlib](../../index.html) / [kotlin](../index.html) / [FunctionIterator](index.html)

# FunctionIterator
An [[Iterator]] which invokes a function to calculate the next value in the iteration until the function returns *null*
```
class FunctionIterator<T : T> 
```
## Members
| Name | Summary |
|------|---------|
|[*.init*](_init_.html)|An [[Iterator]] which invokes a function to calculate the next value in the iteration until the function returns *null*<br>&nbsp;&nbsp;`public FunctionIterator<T : T> (nextFunction: ()->T)`<br>|
|[computeNext](computeNext.html)|&nbsp;&nbsp;`open protected fun computeNext(): Unit`<br>|
|[nextFunction](nextFunction.html)|&nbsp;&nbsp;`val nextFunction: ()->T`<br>|
