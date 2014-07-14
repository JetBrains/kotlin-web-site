---
layout: api
title: reader
---
[stdlib](../index.md) / [kotlin.io](index.md) / [reader](reader.md)

# reader
Creates a reader on an input stream with specified *encoding*
```
public fun InputStream.reader(encoding: Charset): InputStreamReader
public fun InputStream.reader(encoding: String): InputStreamReader
public fun InputStream.reader(encoding: CharsetDecoder): InputStreamReader
```
Creates a new [[FileReader]] for this file
```
public fun File.reader(): FileReader
```
