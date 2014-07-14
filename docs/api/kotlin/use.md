---
layout: api
title: use
---
[stdlib](../index.html) / [kotlin](index.html) / [use](use.html)

# use
Uses the given resource then closes it down correctly whether an exception is thrown or not
```
public fun <T : T, R> T.use(block: (T)->R): R
```
