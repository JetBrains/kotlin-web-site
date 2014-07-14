---
layout: api
title: replaceAll
---
[stdlib](../index.md) / [kotlin](index.md) / [replaceAll](replaceAll.md)

# replaceAll
Replaces every *regexp* occurence in the text with the value retruned by the given function *body* that can handle
```
public fun String.replaceAll(regexp: String, body: (MatchResult)->String): String
```

```
public fun String.replaceAll(regex: String, replacement: String): String
```
## Description
```
public fun String.replaceAll(regexp: String, body: (MatchResult)->String): String
```
particular occurance using [[MatchResult]] provided.

