---
layout: docs
title: "Basic Syntax"
category: docs
---

## Defining Packages

{% highlight kotlin %}
package my.demo // One per file

import std.io.*

// ...

{% endhighlight %}

See [Packages]({% post_url docs/2013-11-15-packages %}).

## Defining functions

{% highlight kotlin %}
// Return type mandatory
fun sum(a : Int, b : Int) : Int {
  return a + b
}
{% endhighlight %}

or

{% highlight kotlin %}
// Return type may be inferred
fun sum(a : Int, b : Int) = a + b
When no meaningful value returned:

fun printSum(a : Int, b : Int) : Unit {
  print(a + b)
}
{% endhighlight %}

or

{% highlight kotlin %}
// Return type is optional when Unit is intended
fun printSum(a : Int, b : Int) {
  print(a + b)
}
{% endhighlight %}

See [Functions]({% post_url docs/2013-11-13-functions %}).


## Defining local variables

Assign-once (read-only) local variable:

{% highlight kotlin %}
val a : Int = 1
val b = 1 // Type is inferred
val c : Int // Type required when no initializer provided
c = 1 // definite assignment
{% endhighlight %}

Note that semicolons are optional.

Mutable variable:

{% highlight kotlin %}
var x = 5 // Type inferred
x += 1
{% endhighlight %}

See also [Properties And Fields]({% post_url docs/2013-11-15-properties %}).

Use a string template

{% highlight kotlin %}
fun main(args : Array<String>) {
  if (args.size == 0) return

  print("First argument: ${args[0]}")
}
{% endhighlight %}

See [String templates]({% post_url docs/2013-11-20-basic-types %}#string-templates).
See [Arrays]({% post_url docs/2013-11-20-basic-types %}#arrays).


## Using conditional expressions

{% highlight kotlin %}
fun max(a : Int, b : Int) : Int {
  if (a > b)
    return a
  else
    return b
}
{% endhighlight %}

or

{% highlight kotlin %}
// 'if' is an expression
fun max(a : Int, b : Int) = if (a > b) a else b
{% endhighlight %}

See if [expressions]({% post_url docs/2013-11-20-expressions %}).

## Null-checks

A reference must be explicitly marked as nullable to be able hold a null:

{% highlight kotlin %}
package multiplier

// Return null if str does not hold a number
fun parseInt(str : String) : Int? {
  // ...
}

fun main(args : Array<String>) {
  if (args.size < 2) {
    print("No number supplied");
  }
  val x = parseInt(args[0])
  val y = parseInt(args[1])

  // We cannot say 'x * y' now because they may hold nulls

  if (x != null && y != null) {
    print(x * y) // Now we can
  }
}
{% endhighlight %}

or

{% highlight kotlin %}
// ...
  if  (x == null) {
    print("Wrong number format in '${args[0]}'")
    return
  }
  if  (y == null) {
    print("Wrong number format in '${args[1]}'")
    return
  }
  print(x * y) // Now we know that x and y are not nulls
{% endhighlight %}

See [Null-safety]({% post_url docs/2013-11-15-null-safety %}).

## is-checks and automatic casts

The is operator checks if an expression is an instance of a type (and more). If we is-checked an immutable local variable or property, there's no need to cast it explicitly to the is-checked type:

{% highlight kotlin %}
fun getStringLength(obj : Any) : Int? {
  if (obj is String)
    return obj.length // no cast to String is needed
  return null
}
{% endhighlight %}

or

{% highlight kotlin %}
fun getStringLength(obj : Any) : Int? {
  if (obj !is String)
    return null
  return obj.length // no cast to String is needed
}
{% endhighlight %}

See [Classes]({% post_url docs/2013-11-14-classes %}) and [Inheritance]({% post_url docs/2013-11-14-classes %}#inheritance).
See [Type casts]({% post_url docs/2013-11-20-typecasts %}).

## Using a for-loop

{% highlight kotlin %}
fun main(args : Array<String>) {
  for (arg in args)
    print(arg)
{% endhighlight %}

// or

{% highlight kotlin %}
for (i in args.indices)
    print(args[i])
}
{% endhighlight %}

See [for-loops]({% post_url docs/2013-11-15-control-flow %}#for-loops).

## Using a while-loop

{% highlight kotlin %}
fun main(args : Array<String>) {
  var i = 0
  while (i < args.size)
    print(args[i++])
}
{% endhighlight %}

See [while-loop]({% post_url docs/2013-11-15-control-flow %}#while-loops).

## Using when-expressions

{% highlight kotlin %}
fun cases(obj : Any) {
  when (obj) {
    1          -> print("One")
    "Hello"    -> print("Greeting")
    is Long    -> print("Long")
    !is String -> print("Not a string")
    else       -> print("Unknown")
  }
}
{% endhighlight %}

See [Pattern Matching]({% post_url docs/2013-11-20-pattern-matching %}).

## Using ranges and in

Check if a number lies within a range:

{% highlight kotlin %}
if (x in 1..y-1)
  print("OK")
{% endhighlight %}

Check if a number is out of range:

{% highlight kotlin %}
if (x !in 0..array.lastIndex)
  print("Out")
{% endhighlight %}

Check if a collection contains an object:

{% highlight kotlin %}
if (obj in collection) // collection.contains(obj) is called
  print("Yes")
{% endhighlight %}

## Iterating over a range:

{% highlight kotlin %}
for (x in 1..5)
  print(x)
{% endhighlight %}

See [Ranges]({% post_url docs/2013-11-20-ranges %}).

Using function literals to filter and map collections

{% highlight kotlin %}
names filter {it.startsWith("A")} sortBy {it} map {it.toUpperCase()} forEach {print(it)}
{% endhighlight %}

See [Higher-order functions and Function literals]({% post_url docs/2013-11-15-lambdas %}).

