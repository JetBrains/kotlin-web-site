[//]: # (title: Null safety)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">Basic types</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">Collections</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">Control flow</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">Functions</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">Classes</a><br />
        <img src="icon-7.svg" width="20" alt="Final step" /> <strong>Null safety</strong><br /></p>
</tldr>

In Kotlin, it's possible to have a `null` value. Kotlin uses `null` values when something is missing or not yet set.
You've already seen an example of Kotlin returning a `null` value in the [Collections](kotlin-tour-collections.md#kotlin-tour-map-no-key)
chapter when you tried to access a key-value pair with a key that doesn't exist in the map. Although it's useful to use
`null` values in this way, you might run into problems if your code isn't prepared to handle them. 

To help prevent issues with `null` values in your programs, Kotlin has null safety in place. Null safety detects
potential problems with `null` values at compile time, rather than at run time.

Null safety is a combination of features that allow you to:

* Explicitly declare when `null` values are allowed in your program.
* Check for `null` values.
* Use safe calls to properties or functions that may contain `null` values.
* Declare actions to take if `null` values are detected.

## Nullable types

Kotlin supports nullable types which allows the possibility for the declared type to have `null` values. By default, a type
is **not** allowed to accept `null` values. Nullable types are declared by explicitly adding `?` after the type declaration.

For example:

```kotlin
fun main() {
    // neverNull has String type
    var neverNull: String = "This can't be null"

    // Throws a compiler error
    neverNull = null

    // nullable has nullable String type
    var nullable: String? = "You can keep a null here"

    // This is OK
    nullable = null

    // By default, null values aren't accepted
    var inferredNonNull = "The compiler assumes non-nullable"

    // Throws a compiler error
    inferredNonNull = null

    // notNull doesn't accept null values
    fun strLength(notNull: String): Int {                 
        return notNull.length
    }

    println(strLength(neverNull)) // 18
    println(strLength(nullable))  // Throws a compiler error
}
```
{kotlin-runnable="true" validate="false" kotlin-min-compiler-version="1.3" id="kotlin-tour-nullable-type"}

> `length` is a property of the [String](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) class that 
> contains the number of characters within a string.
>
{style="tip"}

## Check for null values

You can check for the presence of `null` values within conditional expressions. In the following example, the `describeString()`
function has an `if` statement that checks whether `maybeString` is **not** `null` and if its `length` is greater than zero:

```kotlin
fun describeString(maybeString: String?): String {
    if (maybeString != null && maybeString.length > 0) {
        return "String of length ${maybeString.length}"
    } else {
        return "Empty or null string"
    }
}

fun main() {
    val nullString: String? = null
    println(describeString(nullString))
    // Empty or null string
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-check-nulls"}

## Use safe calls

To safely access properties of an object that might contain a `null` value, use the safe call operator `?.`. The safe call
operator returns `null` if either the object or one of its accessed properties is `null`. This is useful if you want to avoid the presence of `null`
values triggering errors in your code.

In the following example, the `lengthString()` function uses a safe call to return either the length of the string or `null`:

```kotlin
fun lengthString(maybeString: String?): Int? = maybeString?.length

fun main() { 
    val nullString: String? = null
    println(lengthString(nullString))
    // null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-safe-call-property"}

> Safe calls can be chained so that if any property of an object contains a `null` value, then `null` is returned without 
> an error being thrown. For example:
> 
> ```kotlin
>   person.company?.address?.country
> ```
>
{style="tip"}

The safe call operator can also be used to safely call an extension or member function. In this case, a null check is 
performed before the function is called. If the check detects a `null` value, then the call is skipped and `null` is returned.

In the following example, `nullString` is `null` so the invocation of [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html)
is skipped and `null` is returned:

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.uppercase())
    // null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-safe-call-function"}

## Use Elvis operator

You can provide a default value to return if a `null` value is detected by using the **Elvis operator** `?:`.

Write on the left-hand side of the Elvis operator what should be checked for a `null` value.
Write on the right-hand side of the Elvis operator what should be returned if a `null` value is detected.

In the following example, `nullString` is `null` so the safe call to access the `length` property returns a `null` value.
As a result, the Elvis operator returns `0`:

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.length ?: 0)
    // 0
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-elvis-operator"}

For more information about null safety in Kotlin, see [Null safety](null-safety.md).

## Practice

### Exercise {initial-collapse-state="collapsed" collapsible="true"}

You have the `employeeById` function that gives you access to a database of employees of a company. Unfortunately, this 
function returns a value of the `Employee?` type, so the result can be `null`. Your goal is to write a function that 
returns the salary of an employee when their `id` is provided, or `0` if the employee is missing from the database.

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = // Write your code here

fun main() {
    println((1..5).sumOf { id -> salaryById(id) })
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise"}

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = employeeById(id)?.salary ?: 0

fun main() {
    println((1..5).sumOf { id -> salaryById(id) })
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-null-safety-solution"}

## What's next?

Congratulations! Now that you have completed the beginner tour, take your understanding of Kotlin to the next level with
our intermediate tour:

<a href="kotlin-tour-intermediate-extension-functions.md"><img src="start-intermediate-tour.svg" width="700" alt="Start the intermediate Kotlin tour" style="block"/></a>
