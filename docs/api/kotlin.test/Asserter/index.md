---
layout: api
title: Asserter
---
[stdlib](../../index.md) / [kotlin.test](../index.md) / [Asserter](index.md)

# Asserter
A plugin for performing assertions which can reuse JUnit or TestNG
```
abstract public trait Asserter
```

## Members

| Name | Summary |
|------|---------|
|[assertEquals](assertEquals.md)|&nbsp;&nbsp;**`abstract public fun assertEquals(message: String, expected: Any, actual: Any): Unit`**<br>|
|[assertNotNull](assertNotNull.md)|&nbsp;&nbsp;**`abstract public fun assertNotNull(message: String, actual: Any): Unit`**<br>|
|[assertNull](assertNull.md)|&nbsp;&nbsp;**`abstract public fun assertNull(message: String, actual: Any): Unit`**<br>|
|[assertTrue](assertTrue.md)|&nbsp;&nbsp;**`abstract public fun assertTrue(message: String, actual: Boolean): Unit`**<br>|
|[fail](fail.md)|&nbsp;&nbsp;**`abstract public fun fail(message: String): Unit`**<br>|
