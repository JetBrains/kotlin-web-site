---
layout: api
title: <init>
---
[stdlib](../../index.html) / [kotlin](../index.html) / [throws](index.html) / [<init>](_init_.html)

# <init>
This annotation indicates what exceptions should be declared by a function when compiled to a JVM method
```
public throws(exceptionClasses: Array<Class<Throwable>>)
```
## Description
```
public throws(exceptionClasses: Array<Class<Throwable>>)
```
Example:
throws(javaClass<IOException>())
fun readFile(name: String): String {...}
will be translated to
String readFile(String name) throws IOException {...}

