---
layout: api
title: LocaleFormatter
---
[stdlib](../../index.html) / [kotlin.template](../index.html) / [LocaleFormatter](index.html)

# LocaleFormatter
Formats values using a given [[Locale]] for internationalisation
```
open public class LocaleFormatter
```
## Members
| Name | Summary |
|------|---------|
|[*.init*](_init_.html)|Formats values using a given [[Locale]] for internationalisation<br>&nbsp;&nbsp;`public LocaleFormatter(locale: Locale)`<br>|
|[dateFormat](dateFormat.html)|&nbsp;&nbsp;`public val dateFormat: DateFormat`<br>|
|[format](format.html)|&nbsp;&nbsp;`open public fun format(out: Appendable, value: Any): Unit`<br>&nbsp;&nbsp;`public fun format(number: Number): String`<br>&nbsp;&nbsp;`public fun format(date: Date): String`<br>|
|[locale](locale.html)|&nbsp;&nbsp;`val locale: Locale`<br>|
|[numberFormat](numberFormat.html)|&nbsp;&nbsp;`public val numberFormat: NumberFormat`<br>|
|[toString](toString.html)|&nbsp;&nbsp;`open public fun toString(): String`<br>|
