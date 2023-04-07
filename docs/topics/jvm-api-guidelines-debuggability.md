[//]: # (title: Debuggability)

This chapter contains considerations about debuggability.

## Always provide a toString() method

To make debugging easier, add a `toString()` implementation to every class you introduce, even to internal ones. 
If `toString()` is part of a contract, document it explicitly.

The following code is a simplified example from a graphical modeling area:

```kotlin
class Vector2D(val x: Int, val y: Int)

fun main() {
    val result = (1..20).map { Vector2D(it, it) }
	println(result)
}
```

The output of this code is not very useful:

```none
[Vector2D@27bc2616, Vector2D@3941a79c, Vector2D@506e1b77,...]
```

Neither is the information provided in the debug tool window:

<img src="vector-objects-in-debug.png" alt="Vector class objects in the debug tool window" width="500"/>

To make both logging and debugging much more readable, add a simple `toString()` implementation like this:

```kotlin
override fun toString(): String {
    return "Vector2D(x=$x, y=$y)"
}
```

This results in improved output:

```none
[Vector2D(x=1, y=1), Vector2D(x=2, y=2), Vector2D(x=3, y=3), Vector2D(x=4, y=4)
```

<img src="improved-output-of-vector-objects-in-debug.png" alt="Improved output of vector class objects in the debug tool window" width="500"/>

> It might seem a good idea to use data classes because they have a `toString()` method automatically. In the 
> [Backward compatibility](jvm-api-guidelines-backward-compatibility.md) section of this guide, you'll learn 
> [why it's better not to do this](jvm-api-guidelines-backward-compatibility.md#dont-use-data-classes-in-api).
>
{type="note"}

Consider implementing `toString()` even if you don't think the class is going to be printed anywhere, as it can help in 
unexpected ways. For example, inside [builders](https://en.wikipedia.org/wiki/Builder_pattern#:~:text=The%20builder%20pattern%20is%20a,Gang%20of%20Four%20design%20patterns), 
it sometimes may be important if it's the same builder or a new one.

```kotlin
class Person(val name: String?, val age: Int?, val children: List<Person>) {
    override fun toString(): String {
        return "Person(name=$name, age=$age, children=$children)"
    }
}

class PersonBuilder {
    var name: String? = null
    var age: Int? = null
    val children = arrayListOf<Person>()
    fun child(personBuilder: PersonBuilder.() -> Unit = {}) {
        children.add(person(personBuilder))
    }
}

fun person(personBuilder: PersonBuilder.() -> Unit = {}): Person {
    val builder = PersonBuilder()
    builder.personBuilder()
    return Person(builder.name, builder.age, builder.children)
}
```

The intended use of the code above is the following:

<img src="breakpoint-for-person.png" alt="Usage of the person DSL and a breakpoint" width="500"/>

If you set a breakpoint on the line after a closing bracket of the first `child` (as on the picture above), you see 
a non-descriptive string in debug output:

<img src="debug-person-builder.png" alt="Result of a PersonBuilder debugging" width="500"/>

If you add a simple `toString()` implementation like this:

```kotlin
override fun toString(): String {
    return "PersonBuilder(name=$name, age=$age, children=$children)"
}
```

The debug data becomes much clearer:

<img src="debug-person-builder-improved.png" alt="Result of a PersonBuilder improved debugging" width="500"/>

You can also see immediately which fields are set and which are not.

> Be careful with exposing fields in `toString()` because sometimes it's easy to get a `StackOverflowException`. 
> For example, if `children` has a reference to a parent, that would create a circular reference. Also, be careful about 
> exposing lists and maps as `toString()` can expand a deeply-nested hierarchy.
>
{type = "warning"}

## What's next?

Learn about API's [backward-compatibility](jvm-api-guidelines-backward-compatibility.md)
