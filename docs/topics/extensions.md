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

There are also [_extension properties_](#extension-properties) that let you define new properties for existing classes.

## Extension functions

Extension functions are always called on a receiver. The receiver has to have the same type as the class being extended.
In the `.orEmpty()` example, the receiver is the `nonNullString` variable that has `String?` type. 

To declare an extension function, prefix its name with a _receiver type_. In this example, the `.truncate()` function extends the `String` class so the
receiver type is `String`:

```kotlin
fun String.truncate(maxLength: Int): String {
    return if (this.length <= maxLength) this else take(maxLength - 3) + "..."
}

fun main() {
    val shortUsername = "KotlinFan42"
    val longUsername = "JetBrainsLoverForever"

    println("Short username: ${shortUsername.truncate(15)}") // KotlinFan42
    println("Long username:  ${longUsername.truncate(15)}")  // JetBrainsLov...
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-truncate"}

The `this` keyword inside an extension function corresponds to the receiver.

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

    println("Top choice: ${poll.mostVoted()}") // Dogs
}
```

```kotlin
fun <T> List<T>.endpoints(): Pair<T, T> {
    return first() to last()
}

fun main() {
    val cities = listOf("Paris", "London", "Berlin", "Prague")
    val temperatures = listOf(21.0, 19.5, 22.3)

    val cityEndpoints = cities.endpoints()
    val tempEndpoints = temperatures.endpoints()

    println("First and last cities: $cityEndpoints")      // (Paris, Prague)
    println("First and last temperatures: $tempEndpoints") // (21.0, 22.3)
}
```

You need to declare the generic type parameter before the function name to make it available in the receiver type expression.
For more information about generics, see [generic functions](generics.md).

## Extensions are resolved _statically_

Extensions do not actually modify the classes they extend. By defining an extension, you are not inserting new members into
a class, only making new functions callable with the dot-notation on variables of this type.

Extension functions are dispatched _statically_. So which extension function is called is already known at compile time
based on the receiver type. For example:

```kotlin
fun main() {
//sampleStart
    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(s: Shape) {
        println(s.getName())
    }
    
    printClassName(Rectangle())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

This example prints _Shape_, because the extension function called depends only on the declared type of the
parameter `s`, which is the `Shape` class.

If a class has a member function, and an extension function is defined which has the same receiver type,
the same name, and is applicable to given arguments, the _member always wins_. For example:

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

This code prints _Class method_.

However, it's perfectly OK for extension functions to overload member functions that have the same name but a different signature:

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType(i: Int) { println("Extension function #$i") }
    
    Example().printFunctionType(1)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

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
