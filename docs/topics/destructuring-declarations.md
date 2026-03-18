[//]: # (title: Destructuring declarations)

Sometimes it is convenient to *destructure* an object into a number of variables, for example:

```kotlin
val (name, age) = person 
```

This syntax is called a *destructuring declaration*. A destructuring declaration creates multiple variables at once.
You have declared two new variables: `name` and `age`, and can use them independently:

 ```kotlin
println(name)
println(age)
```

A destructuring declaration is compiled down to the following code:

```kotlin
val name = person.component1()
val age = person.component2()
```

The `component1()` and `component2()` functions are another example of the *principle of conventions* widely used in Kotlin 
(see operators like `+` and `*`, `for`-loops as an example). 
Anything can be on the right-hand side of a destructuring declaration, as long as the required number of component 
functions can be called on it. And, of course, there can be `component3()` and `component4()` and so on.

> The `componentN()` functions need to be marked with the `operator` keyword to allow using them in a destructuring 
>declaration.
>
{style="note"}

Destructuring declarations also work in `for`-loops:

```kotlin
for ((a, b) in collection) { ... }
```

Variables `a` and `b` get the values returned by `component1()` and `component2()` called on elements of the collection. 

## Example: returning two values from a function
 
Assume that you need to return two things from a function - for example, a result object and a status of some sort.
A compact way of doing this in Kotlin is to declare a [data class](data-classes.md) and return its instance:

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// Now, to use this function:
val (result, status) = function(...)
```

Since data classes automatically declare `componentN()` functions, destructuring declarations work here.

> You could also use the standard class `Pair` and have `function()` return `Pair<Int, Status>`, 
> but it's often better to have your data named properly.
>
{style="note"}

## Example: destructuring declarations and maps

Probably the nicest way to traverse a map is this:

```kotlin
for ((key, value) in map) {
   // do something with the key and the value
}
```

To make this work, you should 

* Present the map as a sequence of values by providing an `iterator()` function.
* Present each of the elements as a pair by providing functions `component1()` and `component2()`.
  
And indeed, the standard library provides such extensions:

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

So you can freely use destructuring declarations in `for`-loops with maps (as well as collections of data class instances or similar).

## Underscore for unused variables

If you don't need a variable in the destructuring declaration, you can place an underscore instead of its name:

```kotlin
val (_, status) = getResult()
```

The `componentN()` operator functions are not called for the components that are skipped in this way.

## Destructuring in lambdas

You can use the destructuring declarations syntax for lambda parameters.
If a lambda has a parameter of the `Pair` type (or `Map.Entry`, or any other type that has the appropriate `componentN` 
functions), you can introduce several new parameters instead of one by putting them in parentheses:   

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

Note the difference between declaring two parameters and declaring a destructuring pair instead of a parameter:  

```kotlin
{ a -> ... } // one parameter
{ a, b -> ... } // two parameters
{ (a, b) -> ... } // a destructured pair
{ (a, b), c -> ... } // a destructured pair and another parameter
```

If a component of the destructured parameter is unused, you can replace it with the underscore to avoid inventing its name:

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

You can specify the type for the whole destructured parameter or for a specific component separately:

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }
```

## Name-based destructuring
<primary-label ref="experimental-opt-in"/>

Kotlin supports *name-based destructuring declarations*,
where variables match properties by name instead of the position defined by `componentN()` functions in position-based destructuring.

> For more information about name-based destructuring, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0438-name-based-destructuring.md).
>
{style="tip"}

In position-based destructuring, variables correspond to the order of `componentN()` functions, for example:

```kotlin
data class User(val username: String, val email: String)

fun main() {
    val user = User("alice", "alice@example.com")

    val (email, username) = user

    println(email)
    // alice

    println(username)
    // alice@example.com
}
```
{kotlin-runnable="true"}

In this example, because destructuring relies on the order of `componentN()` functions, `email` receives the value of `username`, and `username` receives the value of `email`.

With name-based destructuring, property names determine which values are extracted rather than the position of `componentN()` functions:

```kotlin
fun main() {
    val user = User("alice", "alice@example.com")

    // Uses name-based destructuring with explicit form
    (val mail = email, val name = username) = user

    println(name)
    // alice

    println(mail)
    // alice@example.com
}
```

Name-based destructuring is [Experimental](components-stability.md#stability-levels-explained).
You can control how the compiler interprets destructuring declarations with the `-Xname-based-destructuring` compiler option.

It has the following modes:

* `only-syntax` enables the explicit form of name-based destructuring without changing the behavior of existing destructuring declarations.
* `name-mismatch` reports warnings when position-based destructuring in data classes uses variable names that don't match the property names.
* `complete` enables short-form name-based destructuring with parentheses and continues supporting position-based destructuring with square bracket syntax.

If you use `complete` mode, the short-form destructuring syntax with parentheses matches variables to property names instead of relying on position:

```kotlin
val (email, username) = user
```

To opt in to name-based destructuring in your project, add the compiler option to your build configuration file:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xname-based-destructuring=only-syntax")
    }
}
```

</tab> 
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xname-based-destructuring=only-syntax</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab> 
</tabs>

Opting in to name-based destructuring also introduces a new syntax for position-based destructuring using square brackets.
Use this syntax for types where the order of elements matters, such as lists and other ordered collections, as well as unnamed tuples like `Pair` or `Triple`:

```kotlin
val point = Pair(10, 20)

// Uses position-based destructuring
val [x, y] = point
```
