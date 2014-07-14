---
layout: api
title: ToStringFormatter
---
[stdlib](../../index.md) / [kotlin.template](../index.md) / [ToStringFormatter](index.md)

# ToStringFormatter
Formats strings with no special encoding other than allowing the null text to be
```
open public class ToStringFormatter
```
## Description
```
open public class ToStringFormatter
```
configured


## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|Formats strings with no special encoding other than allowing the null text to be<br>&nbsp;&nbsp;**`public ToStringFormatter()`**<br>|
|[format](format.md)|&nbsp;&nbsp;**`open public fun format(out: Appendable, value: Any): Unit`**<br><br>Formats the given string allowing derived classes to override this method<br>&nbsp;&nbsp;**`open public fun format(out: Appendable, text: String): Unit`**<br>|
|[nullString](nullString.md)|&nbsp;&nbsp;**`val nullString: String`**<br>|
|[toString](toString.md)|&nbsp;&nbsp;**`open public fun toString(): String`**<br>|
