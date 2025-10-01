[//]: # (title: Extensions)

Kotlin _extensions_ let you extend a class or an interface with new functionality without inheriting or using 
design patterns like _Decorator_.

You can write _extension functions_ for a class or an interface from a third-party library that you can't modify.
You call these functions as if they were member functions of the original class.

For example, with the [`.orEmpty()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/or-empty.html) extension function:

```kotlin
fun main() {
//sampleStart
    // nullableString is null
    val nullableString: String? = null
    // Calls .orEmpty() extension function on nullableString
    val nonNullString = nullableString.orEmpty()

    println("Is the string empty? ${nonNullString == ""}") 
    // Is the string empty? true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-isorempty"}

Kotlin provides many useful extension functions from the standard library, such as:

* Operating on collections: [`.map()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map.html), [`.filter()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter.html), [`.reduce()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce.html), [`.fold()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/fold.html), [`.groupBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/group-by.html).
* Converting to strings: [`.joinToString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/join-to-string.html).
* Working with null values: [`.filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html).

There are also [_extension properties_](#extension-properties) that let you define new properties for existing classes.

## Extension functions

Extension functions are always called on a receiver. The receiver has to have the same type as the class being extended.
In the `.orEmpty()` example, the receiver is the `nonNullString` variable that has `String?` type. 

Extensions don't modify the classes they extend. By defining an extension, you aren't inserting new members into
a class, only making new functions callable with the dot-notation on variables of this type.

To declare an extension function, prefix its name with a _receiver type_. In this example, the `.truncate()` function extends the `String` class so the
receiver type is `String`:

```kotlin
fun String.truncate(maxLength: Int): String {
    return if (this.length <= maxLength) this else take(maxLength - 3) + "..."
}

fun main() {
    val shortUsername = "KotlinFan42"
    val longUsername = "JetBrainsLoverForever"

    println("Short username: ${shortUsername.truncate(15)}") 
    // KotlinFan42
    println("Long username:  ${longUsername.truncate(15)}")  
    // JetBrainsLov...
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-truncate"}

The `.truncate()` function truncates any string that it's called on by the number in the `maxLength` argument and adds an ellipsis `...`.
If the string is shorter than `maxLength`, the function returns the original string.

In this example, the `.mostVoted()` function extends the `Map<String, Int>` class:

```kotlin
fun Map<String, Int>.mostVoted(): String? {
    return maxByOrNull { (key, value) -> value }?.key
}

fun main() {
    val poll = mapOf(
        "Cats" to 37,
        "Dogs" to 58,
        "Birds" to 22
    )

    println("Top choice: ${poll.mostVoted()}") 
    // Dogs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-mostvoted"}

The `.mostVoted()` function iterates through the key-value pairs of the map it's called on and uses the [`maxByOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-by-or-null.html)
function to return the key of the pair containing the highest value. If the map is empty, the `maxByOrNull()` function
returns `null`. The `mostVoted()` function uses a safe call `?.` to only access the `key` property when the `maxByOrNull()` function
returns a non-null value.

You can also create generic extension functions. You need to declare the generic type parameter before the function name to make it available in the receiver type expression.
In this example, the `.endpoints()` function extends a `List<T>` class where `T` can be any type:

```kotlin
fun <T> List<T>.endpoints(): Pair<T, T> {
    return first() to last()
}

fun main() {
    val cities = listOf("Paris", "London", "Berlin", "Prague")
    val temperatures = listOf(21.0, 19.5, 22.3)

    val cityEndpoints = cities.endpoints()
    val tempEndpoints = temperatures.endpoints()

    println("First and last cities: $cityEndpoints")      
    // (Paris, Prague)
    println("First and last temperatures: $tempEndpoints") 
    // (21.0, 22.3)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-endpoints"}

The `.endpoints()` function returns a pair containing the first and last elements of the list that it's called on.
Inside the function body, it calls the `first()` and `last()` functions and combines their returned values into a `Pair`
using the `to` infix function.

For more information about generics, see [generic functions](generics.md).

## Extension and member functions

Extension functions are dispatched _statically_, meaning the compiler determines which function to call based on the
receiver type at compile time. For example:

```kotlin
fun main() {
//sampleStart
    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(shape: Shape) {
        println(shape.getName())
    }
    
    printClassName(Rectangle())
    // Shape
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-shape"}

In this example, the compiler calls the `Shape.getName()` extension function because the parameter `shape` is declared
as type `Shape`. Since extension functions are resolved statically, the compiler chooses the function based on the declared
type, not the actual object passed in.

So even though the example passes a `Rectangle` instance, the `.getName()` function resolves to `Shape.getName()` since the 
variable is declared as type `Shape`.

If a class has a member function and there's an extension function with the same receiver type,
the same name, and compatible arguments, the _member function always wins_. For example:

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()
    // Member function
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function"}

However, extension functions can overload member functions that have the same name but a _different_ signature:

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    // Same name but different signature
    fun Example.printFunctionType(index: Int) { println("Extension function #$index") }
    
    Example().printFunctionType(1)
    // Extension function #1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function-overload"}

In this example, since an `Int` is passed to the `.printFunctionType()` function, the compiler chooses the extension
function because it matches the signature. The compiler ignores the member function, which takes no arguments.

## Nullable receiver

Note that extensions can be defined with a nullable receiver type. These extensions can be called on an object variable
even if its value is null. If the receiver is `null`, then `this` is also `null`. So when defining an extension with a 
nullable receiver type, we recommend performing a `this == null` check inside the function body to avoid compiler errors. 

You can call `toString()` in Kotlin without checking for `null`, as the check already happens inside the extension function:

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // After the null check, 'this' is autocast to a non-nullable type, so the toString() below
    // resolves to the member function of the Any class
    return toString()
}
```

## Extension properties

Kotlin supports extension properties much like it supports functions:

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

> Since extensions do not actually insert members into classes, there's no efficient way for an extension
> property to have a [backing field](properties.md#backing-fields). This is why _initializers are not allowed for
> extension properties_. Their behavior can only be defined by explicitly providing getters/setters.
>
{style="note"}

Example:

```kotlin
val House.number = 1 // error: initializers are not allowed for extension properties
```

## Companion object extensions

If a class has a [companion object](object-declarations.md#companion-objects) defined, you can also define extension
functions and properties for the companion object. Just like regular members of the companion object,
they can be called using only the class name as the qualifier:

```kotlin
class MyClass {
    companion object { }  // will be called "Companion"
}

fun MyClass.Companion.printCompanion() { println("companion") }

fun main() {
    MyClass.printCompanion()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Scope of extensions

In most cases, you define extensions on the top level, directly under packages:

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

To use an extension outside its declaring package, import it at the call site:

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

See [Imports](packages.md#imports) for more information.

## Declaring extensions as members

You can declare extensions for one class inside another class. Inside such an extension, there are multiple _implicit receivers_ -
objects whose members can be accessed without a qualifier. An instance of a class in which the extension is declared is called a
_dispatch receiver_, and an instance of the receiver type of the extension method is called an _extension receiver_.

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    fun Host.printConnectionString() {
        printHostname()   // calls Host.printHostname()
        print(":")
        printPort()   // calls Connection.printPort()
    }

    fun connect() {
        /*...*/
        host.printConnectionString()   // calls the extension function
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString()  // error, the extension function is unavailable outside Connection
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

In the event of a name conflict between the members of a dispatch receiver and an extension receiver, the extension receiver takes
precedence. To refer to the member of the dispatch receiver, you can use the [qualified `this` syntax](this-expressions.md#qualified-this).

```kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // calls Host.toString()
        this@Connection.toString()  // calls Connection.toString()
    }
}
```

Extensions declared as members can be declared as `open` and overridden in subclasses. This means that the dispatch of such
functions is virtual with regard to the dispatch receiver type, but static with regard to the extension receiver type.

```kotlin
open class Base { }

class Derived : Base() { }

open class BaseCaller {
    open fun Base.printFunctionInfo() {
        println("Base extension function in BaseCaller")
    }

    open fun Derived.printFunctionInfo() {
        println("Derived extension function in BaseCaller")
    }

    fun call(b: Base) {
        b.printFunctionInfo()   // call the extension function
    }
}

class DerivedCaller: BaseCaller() {
    override fun Base.printFunctionInfo() {
        println("Base extension function in DerivedCaller")
    }

    override fun Derived.printFunctionInfo() {
        println("Derived extension function in DerivedCaller")
    }
}

fun main() {
    BaseCaller().call(Base())   // "Base extension function in BaseCaller"
    DerivedCaller().call(Base())  // "Base extension function in DerivedCaller" - dispatch receiver is resolved virtually
    DerivedCaller().call(Derived())  // "Base extension function in DerivedCaller" - extension receiver is resolved statically
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Note on visibility

Extensions utilize the same [visibility modifiers](visibility-modifiers.md) as regular functions declared in the same scope would.
For example:

* An extension declared at the top level of a file has access to the other `private` top-level declarations in the same file.
* If an extension is declared outside its receiver type, it cannot access the receiver's `private` or `protected` members.
