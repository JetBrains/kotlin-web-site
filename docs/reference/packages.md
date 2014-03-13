---
layout: reference
title: "Packages"
category: reference
subcategory: subcategory-2
---

## Root package
Every module declares a unique root package, that contains all the packages declared in the module.

## Header package declaration
A source file may start with a header package declaration (see the grammar):

{% highlight kotlin %}
package foo.bar

// ...
{% endhighlight %}

All the contents of the source file are (directly or indirectly) contained by its header package. If the header is not specified, the module's root package is used.

## Imports

Apart from the [default imports][#default-imports] declared by the module, each file may contain its own import directives. Syntax for imports is described in the [grammar]({{ site.baseurl }}/docs/reference/grammar.html#imports).

We can import either a single name, e.g.

{% highlight kotlin %}
import foo.Bar // Bar is now accessible without qualification
{% endhighlight %}

or all the accessible contents of a scope (package, class, object etc):

{% highlight kotlin %}
import foo.* // everything in 'foo' becomes accessible
{% endhighlight %}

If there is a name clash, we can disambiguate by using as keyword to locally rename the clashing entity:

{% highlight kotlin %}
import foo.Bar // Bar is accessible
import bar.Bar as bBar // bBar stands for 'bar.Bar'
{% endhighlight %}

## Absolute and relative names

Consider the following example (syntax is fictional):

{% highlight kotlin %}
package a {
  package b {
    val x = 1
    package a {
      val y = a.b.x // Problem
    }
  }
}
{% endhighlight %}

At the line marked "Problem" we have the following potential ambiguity: what does a stand for: the outer package a or the inner one? The rule here is that names are always relative: a is resolved in its scope of occurrence that makes it mean the inner package a, so this code does not compile.

To fix it, we need an absolute name. These start with the package keyword:

{% highlight kotlin %}
package a {
  package b {
    val x = 1
    package a {
      val y = package.root.a.b.x // Fixed
    }
  }
}
{% endhighlight %}

In this example, we assumed that the root package of our module is named root.

Absolute names may be used in imports as well:

{% highlight kotlin %}
import package.root.a.b.a.*
{% endhighlight %}

