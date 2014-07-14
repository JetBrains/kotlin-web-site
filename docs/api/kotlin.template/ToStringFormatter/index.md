---
layout: api
title: ToStringFormatter
---
[stdlib](../../index.html) / [kotlin.template](../index.html) / [ToStringFormatter](index.html)

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
|[*.init*](_init_.html)|Formats strings with no special encoding other than allowing the null text to be<br>&nbsp;&nbsp;`public ToStringFormatter()`<br>|
|[format](format.html)|&nbsp;&nbsp;`open public fun format(out: Appendable, value: Any): Unit`<br><br>Formats the given string allowing derived classes to override this method<br>&nbsp;&nbsp;`open public fun format(out: Appendable, text: String): Unit`<br>|
|[nullString](nullString.html)|&nbsp;&nbsp;`val nullString: String`<br>|
|[toString](toString.html)|&nbsp;&nbsp;`open public fun toString(): String`<br>|
