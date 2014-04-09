---
layout: reference
title: "Type Casts"
category: reference
subcategory: syntax
---


## Smart Casts

In many cases, one does not need to use explicit cast operators in Kotlin, because the compiler tracks the [is-checks for immutable values]({{ site.baseurl }}/docs/reference/pattern-matching.html) and inserts (safe) casts automatically when needed:

{% highlight kotlin %}
fun demo(x : Any) {
  if (x is String) {
    print(x.length) // x is automatically cast to String
  }
}
{% endhighlight %}

Automatic casts work for [when]({{ site.baseurl }}/docs/reference/control-flow.html#when-expressions) expressions and [while loops]({{ site.baseurl }}/docs/reference/control-flow.html#while-loops) as well:

{% highlight kotlin %}
when (x) {
  is Int -> print(x + 1)
  is String -> print(x.length + 1)
  is Array<Int> -> print(x.sum())
}
{% endhighlight %}


## "Unsafe" cast operator

Usually, cast operator throws an exception if the cast is not possible. Thus, we call it unsafe. The unsafe cast in Kotlin is done by an infix operator as (see [operator precedence]({{ site.baseurl }}/docs/reference/grammar.html#operator-precedence)):

{% highlight kotlin %}
val x : String = y as String
{% endhighlight %}

Note that null cannot be cast to String as this type is not [nullable]({{ site.baseurl }}/docs/reference/null-safety.html), i.e. if y is null, the code above throws an exception.
In order to match Java cast semantics we have to have [nullable]({{ site.baseurl }}/docs/reference/null-safety.html) type at cast right hand side, like

{% highlight kotlin %}
val x : String? = y as String?
{% endhighlight %}

## "Safe" (nullable) cast operator

To avoid an exception being thrown, one can use a "safe" cast operator as? that returns null on failure:

{% highlight kotlin %}
val x : String? = y as? String
{% endhighlight %}

Note that despite the fact that the right-hand side of as? is a non-null type String the result of the cast is nullable.

