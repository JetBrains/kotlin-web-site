---
layout: api
title: lines
---
[stdlib](../index.html) / [kotlin.io](index.html) / [lines](lines.html)

# lines
Returns an iterator over each line.
```
public fun BufferedReader.lines(): Stream<String>
```
## Description
```
public fun BufferedReader.lines(): Stream<String>
```
<b>Note</b> the caller must close the underlying <code>BufferedReader</code>
when the iteration is finished; as the user may not complete the iteration loop (e.g. using a method like find() or any() on the iterator
may terminate the iteration early.
<br>
We suggest you try the method useLines() instead which closes the stream when the processing is complete.

