---
layout: reference
title: "Null Safety"
category: reference
subcategory: syntax
---

Kotlin's type system is aimed at eliminating null references from code, also known as the [The Billion Dollar Mistake](http://qconlondon.com/london-2009/presentation/Null+References:+The+Billion+Dollar+Mistake)

One of the most common pitfalls in many programming languages, including Java is that of accessing a member of a null references, resulting in null reference exceptions. In Java this
would be the equivalent of a *NullPointerException*{: .keyword } or NPE for short.

## Nullable types and Non-Null Types

Kotlin's type system is aimed to eliminate NullPointerException's from our code. The only possible causes of NPE's may be

* An explicit call to throw NullPointerException()
* External Java Code has caused it
* There's some data inconsistency with regard to initialization (an uninitialized *this* available in a constructor is used somewhere)

In Kotlin the type system distinguishes between references that can hold null (nullable references) and those that can not (non-null references).
For example, a regular variable of type String can not hold null:

{% highlight kotlin %}
var a : String = "abc"
a = *null*{: .error } // compilation error
{% endhighlight %}

To allow nulls, we can declare a variable as nullable string, written String?:

{% highlight kotlin %}
var b : String? = "abc"
b = null // ok
{% endhighlight %}

Now, if you call a method on a, it's guaranteed not to cause an NPE, so you can safely say

{% highlight kotlin %}
val l = a.length()
{% endhighlight %}

But if you want to call the same method on b, that would not be safe, and the compiler reports an error:

{% highlight kotlin %}
val l = b.length() // error: variable 'b' can be null
{% endhighlight %}

But we still need to call that method, right? There are a few ways of doing that.

## Checking for null in conditions

First, you can explicitly check if b is null, and handle the two options separately:

{% highlight kotlin %}
val l = if (b != null) b.length() else -1
{% endhighlight %}

The compiler tracks the information about the check you performed, and allows the call to length() inside the if. More complex conditions are supported as well:

{% highlight kotlin %}
if (b != null && b.length() > 0)
  print("String of length ${b.length()}")
else
  print("Empty string")
{% endhighlight %}

Note that this only works where b is immutable (i.e. a local *val*{: .keyword } or a member *val*{: .keyword } which has a backing field and is not overridable), because otherwise it might happen that b changes to null after the check.

## Safe Calls

Your second option is the safe call operator, written ?.:

{% highlight kotlin %}
b?.length()
{% endhighlight %}
This returns b.length() if b is not null, and null otherwise. The type of this expression is Int?.

Safe calls are useful in chains. For example, if Bob, an Employee, may be assigned to a Department (or not), that in turn may have another Employee as a department head, then to obtain the name of Bob's department head, if any), we write the following:

{% highlight kotlin %}
bob?.department?.head?.name
{% endhighlight %}

Such a chain returns null if any of the properties in it is null.

## Elvis Operator

When we have a nullable reference r, we can say "if r is not null, use it, otherwise use some non-null value x":

{% highlight kotlin %}
val l : Int = if (b != null) b.length() else -1
{% endhighlight %}

Along with the complete if expression, this can be expressed with the Elvis operator, written ?::

{% highlight kotlin %}
val l = b?.length() ?: -1
{% endhighlight %}

If the expression to the left of ?: is not null, the elvis operator returns it, otherwise it returns the expression to the right. Note that the right-hand side expression is evaluated only if the left-hand side is null.

## The !! Operator

The third option is for NPE-lovers. One can write b!!, and this will return a non-null value of b (e.g., a String in our example) or throw an NPE if b is null:

{% highlight kotlin %}
val l = b!!.length()
{% endhighlight %}

Thus, if you want an NPE, you can have it, but you have to ask for it explicitly, and it does not appear out of the blue.

By the way, !! is added for conciseness, and formerly was emulated by an extension function from the standard library, defined as follows:

{% highlight kotlin %}
inline fun <T : Any> T?.sure() : T =
  if (this == null)
    throw NullPointerException()
  else
    this
{% endhighlight %}

## Safe Casts

Regular casts may result into a ClassCastException if the object is not of the target type. Another option is to use safe casts that return null is the attempt was not successful:

{% highlight kotlin %}
val aInt : Int? = a as? Int
{% endhighlight %}

