---
layout: api
title: readBytes
---
[stdlib](../index.html) / [kotlin.io](index.html) / [readBytes](readBytes.html)

# readBytes
Reads this stream completely into a byte array
```
public fun InputStream.readBytes(estimatedSize: Int): ByteArray
```
Reads the entire content of the URL as bytes
```
public fun URL.readBytes(): ByteArray
```
Reads the entire content of the file as bytes
```
public fun File.readBytes(): ByteArray
```
## Description
```
public fun InputStream.readBytes(estimatedSize: Int): ByteArray
```
**Note** it is the callers responsibility to close this resource

```
public fun URL.readBytes(): ByteArray
```
This method is not recommended on huge files.

```
public fun File.readBytes(): ByteArray
```
This method is not recommended on huge files.

