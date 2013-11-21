---
layout: docs
title: "Functions"
category: docs
---

## Function Declarations

Functions in Kotlin are declared using the *fun*{: .keyword } keyword

{% highlight kotlin %}
fun double(x: Int): Int {
}
{% endhighlight %}


### Parameters

Function parameters are defined using Pascal notation, i.e. *name*: *type*. Parameters are separated using commas. Each parameter must be explicitly typed.

{% highlight kotlin %}
fun powerOf(number: Int, exponent: Int) {
...
}
{% endhighlight %}

### Default Arguments

Function parameters can have default values, which are used when a corresponding argument is omitted. This allows to reduce the number of overloads compared to
other languages.

{% highlight kotlin %}
fun read(b: Array<Byte>, off: Int = 0, len: Int = -1) {
...
}
{% endhighlight %}

Default values are defined using the **=** after type along with the value. Default arguments must be the last in the list, that is, it is not possible to have
a parameter without a default argument following one with a default argument.

### Named Arguments

Function parameters can be named when calling functions. This is very convenient when a function has a high number of parameters or default ones.

Given the following function

{% highlight kotlin %}
fun reformat(str: String, normalizeCase: Boolean = true, upperCaseFirstLetter: Boolean = true, divideByCamelHumps: Boolean = false, wordSeparator: Character = ' ') {
...
}
{% endhighlight %}

we could call this using default arguments

{% highlight kotlin %}
reformat(str)
{% endhighlight %}

However, when calling it with non-default, the call would look something like

{% highlight kotlin %}
reformat(str, true, true, false, '_')
{% endhighlight %}

With named arguments we can make the code much more readable

{% highlight kotlin %}
reformat(str,
    normalizeCase = true,
    uppercaseFirstLetter = true,
    divideByCamelHumps = false,
    wordSeparator = '_'
  )
{% endhighlight %}

and if we do not need all arguments

{% highlight kotlin %}
reformat(str, wordSeparator = '_')
{% endhighlight %}


### Unit returning functions

If a function does not return any useful value, its return type is *Unit*{: .keyword }. *Unit*{: .keyword } is a type with only one value - *Unit.VALUE*{: .keyword }. This
value does not have to be returned explicitly

{% highlight kotlin %}
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello ${name}")
    else
        println("Hi there!")
    // return Unit.VALUE or return is optional
}
{% endhighlight %}

The *Unit*{: .keyword } return type declaration is also optional. The above code is equivalent to

{% highlight kotlin %}
fun printHello(name: String?) {
    ...
}
{% endhighlight %}

### Single-Expression functions

When a function returns a single expression, the curly braces can be omitted and the body is specified after a **=** symbol

{% highlight kotlin %}
fun double(x: Int) : Int = x * 2
{% endhighlight %}

Explicitly declaring the return type is optional as this will be inferred by the compiler

{% highlight kotlin %}
fun double(x: Int) = x * 2
{% endhighlight %}

### Varargs - Variable number of arguments

The last parameter of a function may be marked with *vararg*{: .keyword } annotation

{% highlight kotlin %}
fun asList<T>(vararg ts : T) : List<T> {
  val result = ArrayList<T>()
  for (t in ts) // ts is an Array
    result.add(t)
  return result
}
{% endhighlight %}

allowing a variable number of arguments to be passed in to the function.

By default, *vararg*{: .keyword } creates an array, but this behavior can be customized by providing arguments to the annotation

{% highlight kotlin %}
fun asList<T>(vararg<ArrayList<T>> ts : T) : List<T> = ts // ts is a List now!
{% endhighlight %}

The type argument to the *vararg*{: .keyword } annotation denotes a *builder* type. A call to this function is compiled like so

{% highlight kotlin %}
asList(0, 1, 2)
// Compiles to
val list = ArrayList<Int>(3) // 3 is the size of the structure
list.add(0)
list.add(1)
list.add(2)
asList(list.build()) // For ArrayList, build() just returns the list itself
{% endhighlight %}

As such, a *vararg*{: .keyword } builder must be a type that has

* A constructor that takes one *Int* parameter
* An *add()* function
* A *build()* function

The type of the *vararg*{: .keyword } parameter is the returned type of *build()*

## Function Scope

In Kotlin functions can be declared at top level in a file, meaning you do not need to create a class to hold a function, like languages such as Java, C# or Scala. In addition
to top level functions, Kotlin functions can also be declared local, as member functions and extension functions.

### Local Functions

Kotlin supports local functions, i.e. a function inside another function

{% highlight kotlin %}
fun dfs(graph : Graph){
  fun dfs(current : Vertex, visited : Set<Vertex>) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v, visited)
  }

  dfs(graph.vertices[0], HashSet())
}
{% endhighlight %}

Local function can access local variables of outer functions (i.e. the closure), so in the case above, the *visited* can be a local variable

{% highlight kotlin %}
fun dfs(graph : Graph){
  val visited = HashSet<Vertex>()
  fun dfs(current : Vertex) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v)
  }

  dfs(graph.vertices[0])
}
{% endhighlight %}

Local functions can even return from outer functions using [qualified return expressions]({% post_url docs/2013-11-18-returns %})

{% highlight kotlin %}
fun reachable(from : Vertex, to : Vertex) : Boolean {
  val visited = HashSet<Vertex>()
  fun dfs(current : Vertex) {
    // here we return from the outer function:
    if (current == to) return@reachable true
    // And here -- from local function:
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v)
  }

  dfs(from)
  return false // if dfs() did not return true already
}
{% endhighlight %}

### Member Functions

A member function is a function that is defined inside a class or object

{% highlight kotlin %}
class Simple() {
    fun foo() { print("Foo") }
}
{% endhighlight %}

Member functions are called with dot notation

{% highlight kotlin %}
Sample().foo() // creates instance of class Sample and calls foo
{% endhighlight %}

For more information on classes and overriding members see [Classes]({% post_url docs/2013-11-14-classes %}) and [Inheritance]({% post_url docs/2013-11-14-classes %}#inheritance)

### Generic Functions

Functions can have generic parameters which are specified using angle brackets after the function name and before the value parameters

{% highlight kotlin %}
fun singletonArray<T>(item : T) : Array<T> {
  return Array<T>(1, {item})
}
{% endhighlight %}

For more information on generic functions see [Generics](% post_url docs/2013-11-15-generics %})

### Inline Functions

Inline functions are explained in [High Order Functions]({% post_url docs/2013-11-15-lambdas %}#inline-functions)

### Extension Functions

Extension functions are explained in [their own section]({% post_url docs/2013-11-15-extension-functions %})

### High Order Functions and Lambdas

High Order functions and Lambdas are explained in [their own section]({% post_url docs/2013-11-15-lambdas %})

## Function Usage

Calling functions uses the traditional approach

{% highlight kotlin %}
val result = double(2)
{% endhighlight %}


Calling member functions uses the dot notation

{% highlight kotlin %}
Sample().foo() // create instance of class Sample and calls foo
{% endhighlight %}

### Infix notation

Functions can also be called using infix notations when

* They are member functions or [extension functions]({% post_url docs/2013-11-15-extension-functions %})
* They have a single parameter

{% highlight kotlin %}
// Define extension to Int
fun Int.shl(x: Int) {
..
}

// call extension function using infix notation

1 shl 2

// is the same as

1.shl(2)
{% endhighlight %}

