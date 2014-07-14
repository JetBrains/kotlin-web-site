---
layout: api
title: readBytes
---
[stdlib](../index.md) / [kotlin.io](index.md) / [readBytes](readBytes.md)

# readBytes
Reads the entire content of the URL as bytes
```
public fun URL.readBytes(): ByteArray
```
Reads the entire content of the file as bytes
```
public fun File.readBytes(): ByteArray
```
Reads this stream completely into a byte array
```
public fun InputStream.readBytes(estimatedSize: Int): ByteArray
```
## Description
```
public fun URL.readBytes(): ByteArray
```
This method is not recommended on huge files.

```
public fun File.readBytes(): ByteArray
```
This method is not recommended on huge files.

```
public fun InputStream.readBytes(estimatedSize: Int): ByteArray
```
**Note** it is the callers responsibility to close this resource

