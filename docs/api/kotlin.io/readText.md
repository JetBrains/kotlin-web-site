---
layout: api
title: readText
---
[stdlib](../index.html) / [kotlin.io](index.html) / [readText](readText.html)

# readText
Reads this reader completely as a String
```
public fun Reader.readText(): String
```
Reads the entire content of the URL as a String with the specified character encoding.
```
public fun URL.readText(encoding: Charset): String
```
Reads the entire content of the URL as a String with a character set name
```
public fun URL.readText(encoding: String): String
```
Reads the entire content of the file as a String using a character encoding.
```
public fun File.readText(encoding: Charset): String
```
Reads the entire content of the file as a String using the a character encoding.
```
public fun File.readText(encoding: String): String
```
## Description
```
public fun Reader.readText(): String
```
**Note** it is the callers responsibility to close this resource

```
public fun URL.readText(encoding: Charset): String
```
This method is not recommended on huge files.

```
public fun URL.readText(encoding: String): String
```
This method is not recommended on huge files.

```
public fun File.readText(encoding: Charset): String
```
This method is not recommended on huge files.

```
public fun File.readText(encoding: String): String
```
This method is not recommended on huge files.

