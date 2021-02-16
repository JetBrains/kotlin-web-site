[//]: # (title: Extensions)

Kotlin provides an ability to extend a class with new functionality
without having to inherit from the class or use design patterns such as *Decorator*.
This is done via special declarations called *extensions*.

For example, you can write new functions for a class from a third-party library that you can't modify.
Such functions are available for calling in the usual way as if they were methods of the original class. 
This mechanism is called *extension functions*. There are also *extension properties* that let you define
new properties for existing classes.

## Extension functions

To declare an extension function, prefix its name with a *receiver type*, that means the type being extended.
The following adds a `swap` function to `MutableList<Int>`:

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' corresponds to the list
    this[index1] = this[index2]
    this[index2] = tmp
}
```

The `this` keyword inside an extension function corresponds to the receiver object (the one that is passed before the dot). 
Now, you can call such a function on any `MutableList<Int>`:

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'this' inside 'swap()' will hold the value of 'list'
```

This function makes sense for any `MutableList<T>`, and you can make it generic:

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' corresponds to the list
    this[index1] = this[index2]
    this[index2] = tmp
}
```

You declare the generic type parameter before the function name to make it available in the receiver type expression. 
See [Generic functions](generics.md).

## Extensions are resolved *statically*

Extensions do not actually modify classes they extend. By defining an extension, you do not insert new members into a class,
but merely make new functions callable with the dot-notation on variables of this type.

Extension functions are dispatched *statically*, that means that they are not virtual by receiver type.
An extension function being called is determined by the type of the expression on which the function is invoked,
not by the type of the result of evaluating that expression at runtime. For example:

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

This example prints *Shape*, because the called extension function depends only on the declared type of the
parameter `s`, which is the `Shape` class.

If a class has a member function, and an extension function is defined which has the same receiver type,
the same name, and is applicable to given arguments, the *member always wins*.
For example:

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

This code prints *Class method*.

However, it's perfectly OK for extension functions to overload member functions which have the same name but a different signature:

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType(i: Int) { println("Extension function") }
    
    Example().printFunctionType(1)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Nullable receiver

Note that extensions can be defined with a nullable receiver type. Such extensions can be called on an object variable
even if its value is null, and can check for `this == null` inside the body. 

This way you can call `toString()` in Kotlin without checking for `null`: the check happens inside the extension function.

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // after the null check, 'this' is autocast to a non-null type, so the toString() below
    // resolves to the member function of the Any class
    return toString()
}
```

## Extension properties

Similarly to functions, Kotlin supports extension properties:

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

> Since extensions do not actually insert members into classes, there's no efficient way for an extension 
> property to have a [backing field](properties.md#backing-fields). This is why *initializers are not allowed for 
> extension properties*. Their behavior can only be defined by explicitly providing getters/setters.
>
{type="note"}

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

In most cases, you define extensions on the top level - directly under packages:

```kotlin
package org.example.declarations
 
fun List<String>.getLongestString() { /*...*/}
```

To use such an extension outside its declaring package, import it at the call site:

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

Inside a class, you can declare extensions for another class. Inside such an extension, there are multiple *implicit receivers* -
objects members of which can be accessed without a qualifier. The instance of the class in which the extension is declared is called
*dispatch receiver*, and the instance of the receiver type of the extension method is called *extension receiver*.

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
    //Host("kotl.in").printConnectionString(443)  // error, the extension function is unavailable outside Connection
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

In case of a name conflict between the members of the dispatch receiver and the extension receiver, the extension receiver takes
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

Extensions utilize the same [visibility of other entities](visibility-modifiers.md) as regular functions declared in the same scope would. For example:

* An extension declared at the top level of a file has access to the other `private` top-level declarations in the same file.
* If an extension is declared outside its receiver type, such an extension cannot access the receiver's `private` members.
