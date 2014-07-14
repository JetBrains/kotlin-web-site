---
layout: api
title: kotlin.template
---
[stdlib](../index.html) / [kotlin.template](index.html)

# kotlin.template

```
package kotlin.template
```
## Members
| Name | Summary |
|------|---------|
|[Formatter](Formatter/index.html)|Represents a formatter and encoder of values in a [[StringTemplate]] which understands<br>&nbsp;&nbsp;`abstract public trait Formatter`<br>|
|[HtmlFormatter](HtmlFormatter/index.html)|Formats values for HTML encoding, escaping special characters in HTML.<br>&nbsp;&nbsp;`public class HtmlFormatter`<br>|
|[LocaleFormatter](LocaleFormatter/index.html)|Formats values using a given [[Locale]] for internationalisation<br>&nbsp;&nbsp;`open public class LocaleFormatter`<br>|
|[StringTemplate](StringTemplate/index.html)|&nbsp;&nbsp;`class StringTemplate`<br>|
|[ToStringFormatter](ToStringFormatter/index.html)|Formats strings with no special encoding other than allowing the null text to be<br>&nbsp;&nbsp;`open public class ToStringFormatter`<br>|
|[append](append.html)|Appends the text representation of this string template to the given output<br>&nbsp;&nbsp;`public fun StringTemplate.append(out: Appendable, formatter: Formatter): Unit`<br>|
|[defaultLocale](defaultLocale.html)|&nbsp;&nbsp;`public val defaultLocale: Locale`<br>|
|[toHtml](toHtml.html)|Converts this string template to HTML text<br>&nbsp;&nbsp;`public fun StringTemplate.toHtml(formatter: HtmlFormatter): String`<br>|
|[toLocale](toLocale.html)|Converts this string template to internationalised text using the supplied<br>&nbsp;&nbsp;`public fun StringTemplate.toLocale(formatter: LocaleFormatter): String`<br>|
|[toString](toString.html)|Converts the string template into a string using the given formatter<br>&nbsp;&nbsp;`public fun StringTemplate.toString(formatter: Formatter): String`<br>|
