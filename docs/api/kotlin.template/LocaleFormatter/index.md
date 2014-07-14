---
layout: api
title: LocaleFormatter
---
[stdlib](../../index.md) / [kotlin.template](../index.md) / [LocaleFormatter](index.md)

# LocaleFormatter
Formats values using a given [[Locale]] for internationalisation
```
open public class LocaleFormatter
```

## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|Formats values using a given [[Locale]] for internationalisation<br>&nbsp;&nbsp;**`public LocaleFormatter(locale: Locale)`**<br>|
|[dateFormat](dateFormat.md)|&nbsp;&nbsp;**`public val dateFormat: DateFormat`**<br>|
|[format](format.md)|&nbsp;&nbsp;**`open public fun format(out: Appendable, value: Any): Unit`**<br>&nbsp;&nbsp;**`public fun format(number: Number): String`**<br>&nbsp;&nbsp;**`public fun format(date: Date): String`**<br>|
|[locale](locale.md)|&nbsp;&nbsp;**`val locale: Locale`**<br>|
|[numberFormat](numberFormat.md)|&nbsp;&nbsp;**`public val numberFormat: NumberFormat`**<br>|
|[toString](toString.md)|&nbsp;&nbsp;**`open public fun toString(): String`**<br>|
