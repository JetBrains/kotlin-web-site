---
layout: reference
title: "Idioms"
category: reference
subcategory: basics
---

A collection of random and frequently used idioms in Kotlin.

#### Have a favorite idiom?

If you have a favorite idiom, contribute it. Do a pull request.

### Creating DTO's (POJO's/POCO's)

{% highlight kotlin %}
data class Customer(val name: String, val email: String)
{% endhighlight %}

provides a Customer class with the following functionality

* getters (and setters in case of `var`s) for all properties
* equals()
* hashCode()
* toString()
* copy()
* component1(), component2(), ..., for all properties

### Declaring a final local variable

{% highlight kotlin %}
val a = foo()
{% endhighlight %}

### Default values for function paramters

{% highlight kotlin %}
fun foo(a: Int = 0, b: String = "") { ... }
{% endhighlight %}

### Filtering a list

{% highlight kotlin %}
val positivies = list.filter { x -> x > 0 }
{% endhighlight %}

Or alternatively, even shorter:

{% highlight kotlin %}
val positivies = list.filter { it > 0 }
{% endhighlight %}

### String Interpolation

{% highlight kotlin %}
println("Name $name")
{% endhighlight %}

### Instance Checks

{% highlight kotlin %}
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
{% endhighlight %}

### Traversing a map/list of pairs

{% highlight kotlin %}
for ((k, v) in map) {
    println("$k -> $v")
}
{% endhighlight %}

k,v can be called anything.

### Using ranges

{% highlight kotlin %}
for (i in 1..100) { ... }
for (x in 2..10) { ... }
{% endhighlight %}

### Read-only list

{% highlight kotlin %}
val list = listOf("a", "b", "c")
{% endhighlight %}

### Read-only map

{% highlight kotlin %}
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
{% endhighlight %}

### Accessing a map

{% highlight kotlin %}
println(map["key"])
map["key"] = value
{% endhighlight %}

### Lazy property

{% highlight kotlin %}
val p: String by Delegates.lazy {
    // compute the string
}
{% endhighlight %}

### Extension Functions

{% highlight kotlin %}
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
{% endhighlight %}

### Creating a singleton

object Resource {
    val name = "Name"
}

### If not null shorthand

{% highlight kotlin %}
val files = File("Test").listFiles()

println(files?.size)
{% endhighlight %}

### If not null and else shorthand

{% highlight kotlin %}
val files = File("Test").listFiles()

println(files?.size ?: "empty")
{% endhighlight %}

### Executing a statement if null

{% highlight kotlin %}
val data = ...
val email = data["email"] ?: throw IllegalStateException("Email is missing!")
{% endhighlight %}

### Execute if not null

{% highlight kotlin %}
val data = ...

data?.let {
    ... // execute this block if not null
}
{% endhighlight %}

### Return on when statement

{% highlight kotlin %}
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}
{% endhighlight %}

### Return on try catch block

{% highlight kotlin %}
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // Working with result
}
{% endhighlight %}

### Return on if statement

{% highlight kotlin %}
fun foo(param: Int) {
    val result = if (param == 1) {
        "one"
    } else if (param == 2) {
        "two"
    } else {
        "three"
    }
}
{% endhighlight %}

### Single-expression functions

{% highlight kotlin %}
fun theAnswer() = 42
{% endhighlight %}

This is equivalent to

{% highlight kotlin %}
fun theAnswer() {
    return 42
}
{% endhighlight %}

This can be effectively combined with other idioms, leading to shorter code. E.g. with the when expression:

{% highlight kotlin %}
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
{% endhighlight %}
