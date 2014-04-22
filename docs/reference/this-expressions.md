---
layout: reference
title: "This expressions"
category: reference
subcategory: syntax
---


## This Expression

To denote the current _receiver_, we use *this*{: .keyword } expressions:

* In a member of a [class](classes.html#inheritance), *this*{: .keyword } refers to the current object of that class
  ** *this*{: .keyword } is used to qualified calls to supertype's implementations of members, see [Classes and Inheritance](classes.html#overriding-rules)
* In an [extension function](extension-functions.html) or an [extension function literals](lambdas.html#function-literals), *this*{: .keyword } denotes the _receiver_ parameter that is passed on the left-hand side of a dot.

If *this*{: .keyword } has no qualifiers, it refers to the _innermost enclosing scope_. To refer to *this*{: .keyword } in other scopes, _label qualifiers_ are used:

### Qualified *this*{: .keyword }
{:#qualified}

To access *this*{: .keyword } from an outer scope (a [class](classes.html), or [extension function](extension-functions.html), or labeled [extension function literal](lambdas.html#function-literals) one writes *this{*}{{@label}} where {{@label}} is a [label](returns.html)
on the scope *this*{: .keyword } is meant to be from:

``` kotlin
class A { // implicit label @A
  class B { // implicit label @B
    fun Int.foo() { // implicit label @foo
      val a = this@A // A's this
      val b = this@B // B's this

      val c = this // foo()'s receiver, an Int
      val c1 = this@foo // foo()'s receiver, an Int

      val funLit = {String.() -> // implicit label @
        val d = this // funLit's receiver
        val d1 = this@ // funLit's receiver
      }


      val funLit2 = { (s:String) ->
        val d1 = this // foo()'s receiver, since enclosing function literal doesn't have any receiver
      }
    }
  }
}
```
