---
layout: reference
title: "Annotations"
category: reference
subcategory: syntax
toc: true
---

## Annotation Declaration
Annotations are means of attaching metadata to code. To declare an annotation, put the *annotation*{: .keyword } keyword in front of a class

{% highlight kotlin %}
annotation class fancy {}
{% endhighlight %}

### Usage

{% highlight kotlin %}
[fancy] class Foo {
  [fancy] fun baz([fancy] foo : Int) : Int {
    return [fancy] 1
  }
}
{% endhighlight %}

The square brackets are optional and only required when annotating expressions.

{% highlight kotlin %}
fancy class Foo() {
  fancy fun baz(fancy foo: Int) {
    return [fancy] 1
  }
}
{% endhighlight %}

### Constructors

Annotations may have constructors that take parameters.

{% highlight kotlin %}
annotation class special(val why : String)

special("example") class Foo {}
{% endhighlight %}

## Java Annotations

Java annotations are 100% compatible with Koltin

{% highlight kotlin %}
import org.junit.Test
import org.junit.Assert.*

class Tests {
  Test fun simple() {
    assertEquals(42, getTheAnswer())
  }
}
{% endhighlight %}

Java annotations can also be made to look like modifiers by renaming them on import

{% highlight kotlin %}
import org.junit.Test as test

class Tests {
  test fun simple() {
    ...
  }
}
{% endhighlight %}


