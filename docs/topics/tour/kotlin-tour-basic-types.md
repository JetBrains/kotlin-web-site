[//]: # (title: Basic types)

<microformat>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2.svg" width="20" alt="Second step" /> <strong>Basic types</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">Collections</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">Control flow</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">Functions</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">Classes</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">Null safety</a></p>
</microformat>

Every variable and data structure in Kotlin has a data type. Data types are important because they tell the compiler what you are allowed to 
do with that variable or data structure. In other words, what functions and properties it has.

In the last chapter, Kotlin was able to tell in the previous example that `customers` has type: [`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/).
Kotlin's ability to **infer** the data type is called **type inference**. `customers` is assigned an integer
value. From this, Kotlin infers that `customers` has numerical data type: `Int`. As a result, the compiler knows that you
can perform arithmetic operations with `customers`:

```kotlin
fun main() {
//sampleStart
    var customers = 10

    // Some customers leave the queue
    customers = 8

    customers = customers + 3 // Example of addition: 11
    customers += 7            // Example of addition: 18
    customers -= 3            // Example of subtraction: 15
    customers *= 2            // Example of multiplication: 30
    customers /= 3            // Example of division: 10

    println(customers) // 10
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-arithmetic"}

> `+=`, `-=`, `*=`, `/=`, and `%=` are augmented assignment operators. For more information, see [Augmented assignments](operator-overloading.md#augmented-assignments).
> 
{type="tip"}

In total, Kotlin has the following basic types:

|**Category**| **Basic types**|
|--|--|
| Integers | `Byte`, `Short`, `Int`, `Long` |
| Unsigned integers | `UByte`, `UShort`, `UInt`, `ULong` |
| Floating-point numbers | `Float`, `Double` |
| Booleans | `Boolean` |
| Characters | `Char` |
| Strings | `String` |

For more information on basic types and their properties, see [Basic types](basic-types.md).

With this knowledge, you can declare variables and initialize them later. Kotlin can manage this as long as variables
are initialized before the first read.

To declare a variable without initializing it, specify its type with `:`.

For example:

```kotlin
fun main() {
//sampleStart
    // Variable declared without initialization
    val d: Int
    // Variable initialized
    d = 3

    // Variable explicitly typed and initialized
    val e: String = "hello"

    // Variables can be read because they have been initialized
    println(d) // 3
    println(e) // hello
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-initialization"}

Now that you know how to declare basic types, it's time to learn about [collections](kotlin-tour-collections.md).

## Practice

### Exercise {initial-collapse-state="collapsed"}

Explicitly declare the correct type for each variable:

|---|---|
```kotlin
fun main() {
    val a = 1000
    val b = "log message"
    val c = 3.14
    val d = 100_000_000_000_000
    val e = false
    val f = '\n'
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-exercise"}

|---|---|
```kotlin
fun main() {
    val a: Int = 1000
    val b: String = "log message"
    val c: Double = 3.14
    val d: Long = 100_000_000_000_000
    val e: Boolean = false
    val f: Char = '\n'
}
```
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-basic-types-solution"}

## Next step

[Collections](kotlin-tour-collections.md)

