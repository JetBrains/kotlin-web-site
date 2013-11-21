---
layout: docs
title: "Type Casts"
category: docs
---


## Smart Casts

In many cases, one does not need to use explicit cast operators in Kotlin, because the compiler tracks the [is-checks for immutable values]({% post_url docs/2013-11-20-pattern-matching %}) and inserts (safe) casts automatically when needed:

{% highlight kotlin %}
fun demo(x : Any) {
  if (x is String) {
    print(x.length) // x is automatically cast to String
  }
}
{% endhighlight %}

Automatic casts work for [when]({% post_url docs/2013-11-15-control-flow %}#when-expressions) expressions and [while loops]({% post_url docs/2013-11-15-control-flow %}#while-loops) as well:

{% highlight kotlin %}
when (x) {
  is Int -> print(x + 1)
  is String -> print(x.length + 1)
  is Array<Int> -> print(x.sum())
}
{% endhighlight %}


## "Unsafe" cast operator

Usually, cast operator throws an exception if the cast is not possible. Thus, we call it unsafe. The unsafe cast in Kotlin is done by an infix operator as (see [operator precedence]({% post_url docs/2013-11-15-grammar %}#operator-precedence)):

{% highlight kotlin %}
val x : String = y as String
{% endhighlight %}

Note that null cannot be cast to String as this type is not [nullable]({% post_url docs/2013-11-15-null-safety %}), i.e. if y is null, the code above throws an exception.
In order to match Java cast semantics we have to have [nullable]({% post_url docs/2013-11-15-null-safety %}) type at cast right hand side, like

{% highlight kotlin %}
val x : String? = y as String?
{% endhighlight %}

## "Safe" (nullable) cast operator

To avoid an exception being thrown, one can use a "safe" cast operator as? that returns null on failure:

{% highlight kotlin %}
val x : String? = y as? String
{% endhighlight %}

Note that despite the fact that the right-hand side of as? is a non-null type String the result of the cast is nullable.

