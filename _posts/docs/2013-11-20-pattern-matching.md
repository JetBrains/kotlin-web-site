---
layout: docs
title: "Pattern Matching"
category: docs
---

## is and !is Operators

Pattern matching is performed by is operator that returns true if the pattern matched successfully and false otherwise. It has a negated form !is. The simplest form of pattern matching simply checks if an object conforms to a given type (similar to Java's instanceof check):

{% highlight kotlin %}
//is
if (obj is String) {
  print(obj.length)
}
// !is
if (obj !is String) {
  print("Not a String")
}
else {
  print(obj.length)
}
{% endhighlight %}

See [smart casts]({% post_url docs/2013-11-20-typecasts %}#smart-casts).

Is and !is may be used as branch conditions in when expressions:

{% highlight kotlin %}
when (x) {
  is Int -> print(x)
  is List<*> -> print(x.size())
  !is Number -> print("Not even a number")
  else -> print("can't do anything")
}
{% endhighlight %}


### Patterns
Patterns on the right-hand side of is and !is allow to match against types, constants, structure of tuples and other objects, and to bind objects matched by sub-patterns, to variables.

See the [grammar for patterns]({% post_url docs/2013-11-15-grammar %}patterns).