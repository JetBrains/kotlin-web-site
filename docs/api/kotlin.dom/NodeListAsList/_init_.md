---
layout: api
title: <init>
---
[stdlib](../../index.html) / [kotlin.dom](../index.html) / [NodeListAsList](index.html) / [<init>](_init_.html)

# <init>
TODO this approach generates compiler errors...
```
public NodeListAsList(nodeList: NodeList)
```
## Description
```
public NodeListAsList(nodeList: NodeList)
```
fun Element.addClass(varargs cssClasses: Array<String>): Boolean {
val set = this.classSet
var answer = false
for (cs in cssClasses) {
if (set.add(cs)) {
answer = true
}
}
if (answer) {
this.classSet = classSet
}
return answer
}
fun Element.removeClass(varargs cssClasses: Array<String>): Boolean {
val set = this.classSet
var answer = false
for (cs in cssClasses) {
if (set.remove(cs)) {
answer = true
}
}
if (answer) {
this.classSet = classSet
}
return answer
}

