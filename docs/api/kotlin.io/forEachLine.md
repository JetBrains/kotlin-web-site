---
layout: api
title: forEachLine
---
[stdlib](../index.html) / [kotlin.io](index.html) / [forEachLine](forEachLine.html)

# forEachLine
Reads file line by line. Default charset is UTF-8.
```
fun File.forEachLine(charset: String, closure: (String)->Unit): Unit
```
Iterates through each line of this reader then closing the [[Reader]] when its completed
```
public fun Reader.forEachLine(block: (String)->Unit): Unit
```
## Description
```
fun File.forEachLine(charset: String, closure: (String)->Unit): Unit
```
You may use this function on huge files

