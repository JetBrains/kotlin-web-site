[//]: # (title: Kotlin/JS reflection)

Kotlin/JS provides a limited support for the Kotlin [reflection API](reflection.md). The only supported parts of the API
are:
* [class references](reflection.md#class-references) (`::class`).
* [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/) and [`typeof()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) function.

## Class references

The `::class` syntax returns a reference to the class of an instance, or the class corresponding to the given type.
In Kotlin/JS, the value of a `::class` expression is a stripped-down [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/)
implementation that supports only:
* [simpleName](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/simple-name.html)
and [isInstance()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/is-instance.html) members.
* [cast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/cast.html) and 
[safeCast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/safe-cast.html) extension functions.

In addition to that, you can use [KClass.js](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) to access the
[JsClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-class/index.html) instance corresponding to the class.
The `JsClass` instance itself is a reference to the constructor function.
This can be used to interoperate with JS functions that expect a reference to a constructor.

## KType and typeOf()

The [`typeof()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) function constructs an instance 
of [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/) for a given type.
The `KType` API is fully supported in Kotlin/JS except for Java-specific parts.

## Example

Here is an example of the reflection usage in Kotlin/JS.

```kotlin
open class Shape
class Rectangle : Shape()

inline fun <reified T> accessReifiedTypeArg() =
    println(typeOf<T>().toString())

fun main() {
    val s = Shape()
    val r = Rectangle()

    println(r::class.simpleName) // Prints "Rectangle"
    println(Shape::class.simpleName) // Prints "Shape"
    println(Shape::class.js.name) // Prints "Shape"

    println(Shape::class.isInstance(r)) // Prints "true"
    println(Rectangle::class.isInstance(s)) // Prints "false"
    val rShape = Shape::class.cast(r) // Casts a Rectangle "r" to Shape

    accessReifiedTypeArg<Rectangle>() // Accesses the type via typeOf(). Prints "Rectangle"
}
```


