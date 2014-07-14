---
layout: api
title: copyTo
---
[stdlib](../index.md) / [kotlin.io](index.md) / [copyTo](copyTo.md)

# copyTo
Copies this file to the given output file, returning the number of bytes copied
```
public fun File.copyTo(file: File, bufferSize: Int): Long
```
Copies this reader to the given output writer, returning the number of bytes copied.
```
public fun Reader.copyTo(out: Writer, bufferSize: Int): Long
```
Copies this stream to the given output stream, returning the number of bytes copied
```
public fun InputStream.copyTo(out: OutputStream, bufferSize: Int): Long
```
## Description
```
public fun Reader.copyTo(out: Writer, bufferSize: Int): Long
```
**Note** it is the callers responsibility to close both of these resources

```
public fun InputStream.copyTo(out: OutputStream, bufferSize: Int): Long
```
**Note** it is the callers responsibility to close both of these resources

