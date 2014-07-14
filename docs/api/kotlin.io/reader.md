---
layout: api
title: reader
---
[stdlib](../index.html) / [kotlin.io](index.html) / [reader](reader.html)

# reader
Creates a new [[FileReader]] for this file
```
public fun File.reader(): FileReader
```
Creates a reader on an input stream with specified *encoding*
```
public fun InputStream.reader(encoding: String): InputStreamReader
public fun InputStream.reader(encoding: Charset): InputStreamReader
public fun InputStream.reader(encoding: CharsetDecoder): InputStreamReader
```
