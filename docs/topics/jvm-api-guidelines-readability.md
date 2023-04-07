[//]: # (title: Readability)

This chapter contains considerations about [API consistency](#api-consistency) and the following advices:
* [Use builder DSL](#use-builder-dsl)
* [Use constructor-like functions where applicable](#use-constructor-like-functions-where-applicable)
* [Use member and extension functions appropriately](#use-member-and-extension-functions-appropriately)
* [Avoid using Boolean arguments in functions](#avoid-using-boolean-arguments-in-functions)

## API consistency

A consistent and well-documented API is crucial for a good development experience. The same is valid for argument order, 
overall naming scheme, and overloads. Also, it's worth documenting all conventions.

For example, if one of your methods accepts `offset` and `length` as parameters, then so should other methods instead of 
accepting `startIndex` and `endIndex`. Parameters like these are most likely of  `Int` or `Long` type, and thus it's 
very easy to confuse them.

The same works for parameter order: Keep it consistent between methods and overloads. Otherwise, users of your library 
might guess incorrectly the order they should pass arguments.

Here is an example of both preserving the parameter order and consistent naming:

```kotlin
fun String.chop(length: Int): String = substring(0, length)
fun String.chop(length: Int, startIndex: Int) = substring(startIndex, length + startIndex)
```

If you have many lookalike methods, name them consistently and predictably. This is how the `stdlib` API works: 
there are methods `first()` and `firstOrNull()`, `single()` and `singleOrNull()`, and so on. It's clear from their names 
that they are all pairs, and some of them might return `null` while others might throw an exception.

## Use builder DSL

["Builder"](https://en.wikipedia.org/wiki/Builder_pattern#:~:text=The%20builder%20pattern%20is%20a,Gang%20of%20Four%20design%20patterns) 
is a well-known pattern in development. It allows you to build a complex entity, not in a single expression, 
but gradually while getting more information. When you need to use a builder, it's better to write it using builder DSL — 
this is binary-compatible and more idiomatic.

A canonical example of a Kotlin builder DSL is `kotlinx.html`. Consider this example:

```kotlin
header("modal-card-head") {
  p("modal-card-title") {
    +book.book.name
  }
  button(classes = "delete") {
    attributes["aria-label"] = "close"
    attributes["_"] = closeModalScript
  }
}
```

It could be implemented as a traditional builder. But this is considerably more verbose:

```kotlin
headerBuilder()
   .addClasses("modal-card-head")
   .addElement(
       pBuilder()
           .addClasses("modal-card-title")
           .addContent(book.book.name)
           .build()
   )
   .addElement(
       buttonBuilder()
           .addClasses("delete")
           .addAttribute("aria-label", "close")
           .addAttribute("_", closeModalScript)
           .build()
   )
   .build()
```

It has too many details that you don't necessarily need to know and requires you to build each entity at the end.

The situation worsens further if you need to generate something dynamically in a loop. In this scenario, you have 
to instantiate a variable and dynamically overwrite it:

```kotlin
var buttonBuilder = buttonBuilder()
   .addClasses("delete")
for((attributeName, attributeValue) in attributes){
   buttonBuilder= buttonBuilder.addAttribute(attributeName, attributeValue)
}
buttonBuilder.build()
```

Inside the builder DSL, you can directly call a loop and all necessary DSL calls:

```kotlin
div("tags") {
  for (genre in book.genres) {
    span("tag is-rounded is-normal is-info is-light") {
      +genre
    }
  }
}
```

Keep in mind that inside curly braces it's impossible to check at compile time if you have set all the required attributes. 
To avoid this, put required arguments as function arguments, not as builder's properties. For example, if you want "href" 
to be a mandatory HTML attribute, your function will look like:

```kotlin
fun a(href: String, block: A.() -> Unit): A
```

And not just:

```kotlin
fun a(block: A.() -> Unit): A
```

> Builder DSLs are backward compatible as long as you don't delete anything from them. Typically this isn't a problem 
> because most developers just add more properties to their builder classes over time.
>
{type="note"}

## Use constructor-like functions where applicable

Sometimes, it makes sense to simplify your API's appearance by using constructor-like functions. A constructor-like function 
is a function whose name starts with a capital letter so it looks like a constructor. This approach can make your library 
easier to understand.

For example, you want to introduce some [Option type](https://en.wikipedia.org/wiki/Option_type) in your library:

```kotlin
sealed interface Option<T>
class Some<T : Any>(val t: T) : Option<T>
object None : Option<Nothing>
```

You can define implementations of all the `Option` interface methods — `map()`, `flatMap()`, and so on. But each time 
your API users create such an `Option`, they must write some logic and check what they create. For example:

```kotlin
fun findById(id: Int): Option<Person> {
    val person = db.personById(id)
    return if (person == null) None else Some(person)
}
```

Instead of having to write the same check each time, you can add just one line to your API:

```kotlin
fun <T> Option(t: T?): Option<out T & Any> = if (t == null) None else Some(t)

// Usage of the code above:
fun findById(id: Int): Option<Person> = Option(db.personById(id))
```

Now, creating a valid `Option` is a no-brainer: just call `Option(x)` and you have a null-safe, purely functional `Option` idiom.

Another use case for using a constructor-like function is when you need to return some "hidden" things: a private instance, 
or some internal object. For example, let's look at a method from the standard library:

```kotlin
public fun <T> listOf(vararg elements: T): List<T> = if (elements.isNotEmpty()) elements.asList() else emptyList()
```

In the code above, `emptyList()` returns the following:

```kotlin
internal object EmptyList : List<Nothing>, Serializable, RandomAccess
```

You can write a constructor-like function to lower the [cognitive complexity](jvm-api-guidelines-introduction.md#cognitive-complexity) 
of your code and reduce the size of your API:

```kotlin
fun <T>  List(): List<T> = EmptyList

// Usage of the code above:
public fun <T> listOf(vararg elements: T): List<T> = if (elements.isNotEmpty()) elements.asList() else List()
```

## Use member and extension functions appropriately

Write only the very core of the API as [member functions](functions.md#member-functions) and everything else as 
[extension functions](extensions.md#extension-functions). It allows you to clearly show to the reader what's 
the core functionality and what's not.

For example, consider a class for a graph:

```kotlin
class Graph {
    private val _vertices: MutableSet<Int> = mutableSetOf()
	private val _edges: MutableMap<Int, MutableSet<Int>> = mutableMapOf()

	fun addVertex(vertex: Int) {
        _vertices.add(vertex)
	}

	fun addEdge(vertex1: Int, vertex2: Int) {
        _vertices.add(vertex1)
        _vertices.add(vertex2)
        _edges.getOrPut(vertex1) { mutableSetOf() }.add(vertex2)
        _edges.getOrPut(vertex2) { mutableSetOf() }.add(vertex1)
	}

	val vertices: Set<Int> get() = _vertices
        val edges: Map<Int, Set<Int>> get() = _edges
}
```

There is a bare minimum of vertices and edges as private variables, functions to add vertices and edges, and 
accessor functions that return an immutable representation of the current state.

You can add all the remaining functionality outside the class:

```kotlin
fun Graph.getNumberOfVertices(): Int = vertices.size
fun Graph.getNumberOfEdges(): Int = edges.size
fun Graph.getDegree(vertex: Int): Int = edges[vertex]?.size ?: 0
```

So, only properties, overrides, and accessors should be members.

## Avoid using Boolean arguments in functions

It's almost impossible to understand what the purpose of a `Boolean` argument is just by reading code anywhere except 
in IDEs, for example, on some version control system sites. Using [named arguments](functions.md#named-arguments) can help 
to clarify this, but for now in IDEs, there is no way to force developers to use them. Another option is to create a function 
that contains the action of the `Boolean` argument and give this function a descriptive name.

For example, in the standard library there are two functions for `map()`: `map(transform: (T) -> R)` 
and `mapNotNull(transform: (T) -> R?)`. It was possible to add something like `map(filterNulls: Boolean)` 
and write code like this:

```kotlin
listOf(1, null, 2).map(false){ it.toString() }
```

From reading this code, it's tough to infer what `false` actually means. However, if you use the `mapNotNull()` function, 
you can understand the logic at first glance:

```kotlin
listOf(1, null, 2).mapNotNull { it.toString() } 
```

## What's next?

Learn about API's:
* [Predictability](jvm-api-guidelines-predictability.md)
* [Debuggability](jvm-api-guidelines-debuggability.md)
* [Backward-compatibility](jvm-api-guidelines-backward-compatibility.md)
