---
layout: api
title: forEachBlock
---
[stdlib](../index.html) / [kotlin.io](index.html) / [forEachBlock](forEachBlock.html)

# forEachBlock
Reads file by byte blocks and calls closure for each block read. Block size depends on implementation but never less than 512.
```
fun File.forEachBlock(closure: (ByteArray, Int)->Unit): Unit
```
## Description
```
fun File.forEachBlock(closure: (ByteArray, Int)->Unit): Unit
```
This functions passes byte array and amount of bytes in this buffer to the closure function.
You can use this function for huge files

