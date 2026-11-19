[//]: # (title: Destructuring declarations)

You can _destructure_ an object into multiple variables with a _destructuring declaration_.

There are two kinds of destructuring declarations:

* [_Name-based destructuring_](#name-based-destructuring), where variables match properties by name.
* [_Position-based destructuring_](#position-based-destructuring), where variables correspond to the order of `componentN()` functions.

You can destructure an object using either the short form or the explicit form.

To destructure an object with the short form, declare the variables together inside parentheses:

```kotlin
val (name, age) = person
```

Depending on the configured mode, the short form matches variables by position or by name.
For more information, see [Configure short-form destructuring](#configure-short-form-destructuring).

To destructure an object with the explicit form, declare each variable separately:

```kotlin
// Matches variables to properties by name
(val name, val age) = person

// Matches variables to components by position
[val name, val age] = person
```

## Name-based destructuring

> For more information about name-based destructuring, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0438-name-based-destructuring.md).
>
{style="tip"}

In a name-based destructuring declaration, property names determine which property values are assigned to variables:

```kotlin
(val name, var age) = person
```

This declaration is equivalent to:

```kotlin
val name = person.name
var age = person.age
```

The variable and property names don't have to match.
You can declare a variable with a different name in the explicit form by specifying the variable name before `=` and the property name after it:

```kotlin
(val personName = name, var personAge = age) = person
```

This is useful, for example, when migrating from position-based to name-based destructuring.

Because variables match properties by name, their order in the declaration doesn't affect which values are extracted:

```kotlin
data class User(val username: String, val email: String)

fun main() {
    val user = User("alice", "alice@example.com")

    // Uses name-based destructuring with the explicit form
    (val mail = email, val name = username) = user

    println(name)
    // alice

    println(mail)
    // alice@example.com
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.5.0"}

## Position-based destructuring

To use position-based destructuring, declare each variable inside square brackets:

```kotlin
[val name, val age] = person
```

This declaration is equivalent to:

```kotlin
val name = person.component1()
val age = person.component2()
```

The `componentN()` functions follow the _principle of conventions_ widely used in Kotlin, such as operators like `+` and `*`, and `for` loops. 
Anything can be on the right-hand side of a position-based destructuring declaration, as long as the required number of `componentN()`
functions can be called on it.

> To use a `componentN()` function in a destructuring declaration, mark it with the `operator` keyword.
>
{style="note"}

### Destructuring declarations and maps

Map entries have a defined key-value order, so you can traverse a map with position-based destructuring:

```kotlin
for ((key, value) in map) {
    // Uses the key and value
}
```

This works because the standard library provides an `iterator()` function for `Map` and `component1()` and
`component2()` functions for `Map.Entry`:

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

### Unused variables

If you don't need a variable in a position-based destructuring declaration, replace its name with an underscore:

```kotlin
val (_, status) = getResult()
```

The `componentN()` function isn't called for a component skipped in this way.

## Destructuring declarations in `for` loops

You can use destructuring declarations to declare variables for each element in a `for` loop:

```kotlin
data class Person(val name: String, val age: Int)

fun main() {
    val people = listOf(
        Person("Alice", 29),
        Person("Bob", 31)
    )

    // Destructures each element by property name
    for ((val name, val age) in people) {
        println("$name is $age years old")
    }

    val scores = mapOf("Alice" to 10, "Bob" to 8)

    // Destructures each map entry by position
    for ([name, score] in scores) {
        println("$name: $score")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.5.0"}

On each iteration, the declaration destructures the next element in the collection.

## Return two values from a function

If you need to return two related values from a function, you can store them in a data class and return its instance:

```kotlin
enum class Status {
    SUCCESS
}

data class Result(val result: Int, val status: Status)

fun calculateResult(): Result = Result(42, Status.SUCCESS)

fun main() {
    val calculation = calculateResult()

    // Uses the descriptive result property
    println(calculation.result)
    // 42

    // Uses the descriptive status property
    println(calculation.status)
    // SUCCESS

    (val result, val status) = calculation
    println("$result: $status")
    // 42: SUCCESS
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.5.0"}

Although you can also return a `Pair` and destructure it by position, its properties have the generic names `first` and `second`:

```kotlin
enum class Status {
    SUCCESS
}

//sampleStart
fun calculateResult(): Pair<Int, Status> = 42 to Status.SUCCESS

fun main() {
    val calculation = calculateResult()
    
    // Uses the generic first property
    println(calculation.first)
    // 42

    // Uses the generic second property
    println(calculation.second)
    // SUCCESS

    val [result, status] = calculation
    println("$result: $status")
    // 42: SUCCESS
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.5.0"}

## Destructuring declarations in lambdas

You can use destructuring declarations for lambda parameters.

To destructure a lambda parameter by position, use a type that defines the required `componentN()` functions, such as `Pair` or `Map.Entry`:

```kotlin
fun main() {
    val map = mapOf(1 to "one", 2 to "two")

    // Uses a regular lambda parameter
    val firstResult = map.map { entry ->
        "${entry.key}: ${entry.value}"
    }

    // Destructures the lambda parameter
    val secondResult = map.map { [key, value] ->
        "$key: $value"
    }

    println(firstResult)
    // [1: one, 2: two]

    println(secondResult)
    // [1: one, 2: two]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.5.0"}

When you destructure a lambda parameter, it still counts as a single parameter:

```kotlin
{ a -> ... }           // One parameter
{ a, b -> ... }        // Two parameters
{ [a, b] -> ... }      // One parameter destructured by position
{ [a, b], c -> ... }   // One destructured parameter and one regular parameter
```

You can specify a type for the whole destructured parameter or for an individual variable:

```kotlin
map.mapValues { [_, value]: Map.Entry<Int, String> -> "$value!" }

map.mapValues { [_, value: String] -> "$value!" }
```

## Configure short-form destructuring

The `-Xname-based-destructuring` compiler option controls whether parenthesized short-form declarations use position-based or name-based destructuring:

* `only-syntax` uses position-based destructuring for the parenthesized short form (default).
* `name-mismatch` uses position-based destructuring for the parenthesized short form and reports warnings when variable names used for data classes don't match their property names.
* `complete` uses name-based destructuring for the parenthesized short form.

The `name-mismatch` and `complete` modes are [Experimental](components-stability.md#stability-levels-explained).
To opt in, add the `-Xname-based-destructuring` compiler option to your build configuration file with the mode name as its value:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xname-based-destructuring=name-mismatch")
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
                    <arg>-Xname-based-destructuring=name-mismatch</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab> 
</tabs>

> Before enabling `complete` mode, review and resolve the warnings reported in `name-mismatch` mode.
> These warnings show which destructuring declarations the compiler interprets differently in `complete` mode and include suggestions for rewriting those declarations.
>
{style="tip"}

If you use `complete` mode, the short-form destructuring syntax with parentheses matches variables to property names instead of relying on position:

```kotlin
val (email, username) = user
```
