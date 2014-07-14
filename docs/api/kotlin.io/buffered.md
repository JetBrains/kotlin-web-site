---
layout: api
title: buffered
---
[stdlib](../index.md) / [kotlin.io](index.md) / [buffered](buffered.md)

# buffered
Creates a buffered writer, or returns self if Writer is already buffered
```
public fun Writer.buffered(bufferSize: Int): BufferedWriter
```
Creates a buffered reader, or returns self if Reader is already buffered
```
public fun Reader.buffered(bufferSize: Int): BufferedReader
```
Creates a buffered output stream
```
public fun OutputStream.buffered(bufferSize: Int): BufferedOutputStream
```
Creates a buffered input stream
```
public fun InputStream.buffered(bufferSize: Int): InputStream
```
