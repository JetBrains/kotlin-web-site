[//]: # (title: Null safety)

Null safety is a Kotlin feature designed to eliminate the danger of null references, also known as [The Billion-Dollar Mistake](https://en.wikipedia.org/wiki/Null_pointer#History).

One of the most common pitfalls in many programming languages, including Java, is that accessing a member of a null
reference will result in a null reference exception. In Java, this would be the equivalent of a `NullPointerException`,
or an _NPE_ for short.

Kotlin explicitly supports nullability as part of its type system, meaning you can explicitly declare 
which variables or properties are allowed to be null. Also, when you declare non-null variables, the compiler 
enforces that these variables cannot hold a `null` value,
preventing an NPE. 

Kotlin's null safety ensures safer code by catching potential null-related issues at compile time rather than runtime. 
This feature enhances code robustness, readability, and maintainability by explicitly expressing null values, making the code easier to understand and manage.

Thanks to null safety, the only possible causes of an NPE in Kotlin are:

* An explicit call to `throw NullPointerException()`
* Usage of the [`!!` operator](#not-null-assertion-operator)
* Data inconsistency concerning initialization, such as when:
  * An uninitialized `this` available in a constructor is passed and used somewhere (a "leaking `this`")
  * A [superclass constructor calls an open member](inheritance.md#derived-class-initialization-order) whose implementation
    in the derived class uses an uninitialized state
* Java interoperation:
  * Attempts to access a member of a `null` reference of a [platform type](java-interop.md#null-safety-and-platform-types)
  * Nullability issues with generic types for Java interoperation. For example, a piece of Java code might add
    `null` into a Kotlin `MutableList<String>`, therefore requiring a `MutableList<String?>` for working with it
  * Other issues caused by external Java code

## Nullable types and non-nullable types

In Kotlin, the type system distinguishes between types that can hold `null` (nullable types) and those that
cannot (non-nullable types). For example, a regular variable of type `String` cannot hold `null`:

```kotlin
fun main() {
//sampleStart
    // Assigns a non-null string to a variable
    var a: String = "abc"
    // Re-assigns null to the non-nullable variable
    a = null
    print(a)
    // Null can not be a value of a non-null type String
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

You can safely call a method or access a property on `a`. It's guaranteed not to cause an NPE because `a` is a non-nullable variable.
The compiler ensures that `a` always holds a valid `String` value, and there's no risk of accessing its properties or methods when it's `null`.

```kotlin
fun main() {
//sampleStart
    // Assigns a non-null string to a variable
    val a: String = "abc"
    // Returns the length of a non-nullable variable
    val l = a.length
    print(l)
    // 3
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

To allow nulls, declare a variable with a `?` sign right after the variable type. For example, 
declare a nullable string by writing `String?`. This expression makes `String` a type that
can accept nullables:

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    var b: String? = "abc"
    // Re-assigns null to the nullable variable
    b = null
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

If you want to access `length` on `b`, the compiler reports an error. This is because `b` is declared as a nullable
variable and can hold `null` values. Trying to directly access properties on nullables leads to an NPE:

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable  
    var b: String? = "abc"
    // Re-assigns null to the nullable variable
    b = null
    // Tries to directly return the length of a nullable variable
    val l = b.length
    print(l)
    // Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type String? 
//sampleEnd
}
```
{kotlin-runnable="true"}

In the code above, the compiler requires you to use safe calls to check for nullability and then access properties or 
perform operations. There are a few ways to check for nullability.

## Checking for `null` with the `if` conditional

When working with nullable types, you need to handle nullability safely to avoid an NPE. One alternative is to 
check for nullability explicitly with the `if` conditional expression. 

For example, check whether `b` is `null` and then access `b.length`:

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable
    val b: String? = null
    // Checks for nullability first and then accesses length
    val l = if (b != null) b.length else -1
    print(l)
    // -1
//sampleEnd
}
```
{kotlin-runnable="true"}

The compiler tracks the information about the check you performed and allows the call to `length` inside the `if`.

More complex conditions are supported as well:

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable  
    val b: String? = "Kotlin"

    // Checks for nullability first and then accesses length
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
        // Provides alternative if the condition is not met  
    } else {
        print("Empty string")
    }
    // String of length 6
//sampleEnd
}
```
{kotlin-runnable="true"}

Note that the example above only works when the compiler can guarantee that `b` won't change between the check and its usage, same as 
the [smart cast prerequisites](typecasts.md#smart-cast-prerequisites).

## Safe call operator (`?.`)

The safe call operator (`?.`) allows you to handle nullability safely in a shorter form. Instead of throwing an NPE, 
if the object is `null`, the `?` operator simply returns `null`:

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable  
    val a: String? = "Kotlin"
    // Assigns null to a nullable variable
    val b: String? = null
    // Checks for nullability and returns length or null
    println(a?.length)
    // 6
    println(b?.length)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

The `b?.length` expression checks for nullability and returns `b.length` if `b` is not null or `null` otherwise. The type of this expression is `Int?`.

You can use `?.` with both [`var` and `val` variables](basic-syntax.md#variables) in Kotlin:

* **`var`:** If you declare it as nullable (for example, `var nullableValue: String?`), it can hold a null or non-null value, and you can change it to `null` at any point.
* **`val`:** If you declare it as nullable (for example, `val nullableValue: String?`), it can hold a null or non-null value, but you can't change it subsequently.

Safe calls are useful in chains. For example, Bob is an employee who may be assigned to a department (or not). That department
may, in turn, have another employee as a department head. To obtain the name of Bob's department head (if there is one),
you write the following:

```kotlin
bob?.department?.head?.name
```

Such a chain returns `null` if any of its properties are `null`. Here's the equivalent of the same safe call but with the `if` conditional:

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

You can also place a safe call on the left side of an assignment. Then, if one of the receivers in the safe calls chain
is `null`, the assignment is skipped, and the expression on the right is not evaluated at all. For example, if either 
`person` or `person.department` is null, the function is not called:

```kotlin
person?.department?.head = managersPool.getManager()
```

## Elvis operator (`?:`)

When you have a nullable type, you can check for `null` and provide an alternative value. For example, if `b` is not `null`,
access `b.length`. Otherwise, use some non-null value:

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Checks for nullability. If not null, returns length. If null, returns a non-null value
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

Instead of writing the complete `if` expression, you can also express this in a shorter manner with the Elvis operator `?:`:

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Checks for nullability. If not null, returns length. If null, returns a non-null value
    val l = b?.length ?: 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

If the expression to the left of `?:` is not `null`, the Elvis operator returns it. Otherwise, the Elvis operator returns the expression
to the right. The expression on the right-hand side is evaluated only if the left-hand side is `null`.

Since `throw` and `return` are expressions in Kotlin, you can also use them on
the right-hand side of the Elvis operator. This can be handy, for example, when checking function arguments:

```kotlin
fun foo(node: Node): String? {
    // Checks for getParent(). If not null, it's assigned to parent. If null, returns null
    val parent = node.getParent() ?: return null
    // Checks for getName(). If not null, it's assigned to name. If null, throws exception
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## Not-null assertion operator (`!!`)

The not-null assertion operator (`!!`) converts any value to a non-nullable type.

When you apply `!!` to a variable whose value is not `null`, it's safely handled as a non-nullable type, 
and the code executes normally. However, if the value is `null`, the `!!` operator forces it to be treated as non-nullable, 
which results in an exception.

When `b` is not null and `!!` makes it return its non-null value (which is a `String` in this example), it accesses `length` correctly:

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable  
    val b: String? = "Kotlin"
    // Treats b as non-null and accesses its length
    val l = b!!.length
    println(l)
    // 6
//sampleEnd
}
```
{kotlin-runnable="true"}

When `b` is null and `!!` makes it return its non-null value, and an NPE occurs:

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Treats b as non-null and tries to access its length
    val l = b!!.length
    println(l) 
    // Exception in thread "main" java.lang.NullPointerException
//sampleEnd
}
```
{kotlin-runnable="true"}

Thus, if you want an NPE, you can have `!!`, but you have to ask for it explicitly.

## Nullable receiver

You can use extension functions with a [nullable receiver type](extensions.md#nullable-receiver). This means the 
function can be called on variables that might be null.

By defining an extension function on a nullable receiver type, you can handle null values within the function itself 
instead of checking for null at every place where you call the function.

For example, the [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html) extension function 
can be called on a nullable receiver. When invoked on a null value, it safely returns the string "null" without throwing an exception:

```kotlin
// SampleStart
fun main() {
    // Assigns null to a nullable Person object stored in the person variable
    val person: Person? = null

    // Applies toString to the nullable person variable and prints a string
    println(person.toString())
    // null
}

// Defines a simple Person class
data class Person(val name: String)
// SampleEnd
```
{kotlin-runnable="true"}

In the example above, even though `person` is `null`, `toString()` safely returns the string "null". This can be helpful in situations like debugging and logging.

If you want your `toString()` invocation to return a nullable string (either a string representation or null), use the [safe-call operator `?.`](#safe-call-operator).
This operator checks if the receiver is `null`. If so, the code returns `null`, preventing exceptions. Otherwise, the code prints the result of `person.toString()`.

```kotlin
// SampleStart
fun main() {
    // Assigns a nullable Person object to a variable
    val person1: Person? = null
    val person2: Person? = Person("Alice")

    // Prints "null" if person is null; otherwise prints the result of person.toString()
    println(person1?.toString())
    // null
    println(person2?.toString())
    // Person(name=Alice)
}

// Defines a Person class
data class Person(val name: String)
// SampleEnd
```
{kotlin-runnable="true"}

The `?.` operator allows you to safely handle potential null values while still accessing properties or methods of objects that might be null.

## Let function

To handle null values and perform operations only on non-null types, you can use the safe call operator `?` together with the
[`let` function](scope-functions.md#let). 

They are useful to evaluate an expression, check the result for null, and execute code only if it's not null, avoiding manual null checks:

```kotlin
fun main() {
//sampleStart
    // Declares a list of nullable strings
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // Iterates over each item in the list
    for (item in listWithNulls) {
        // Checks if the item is null and only prints non-null values
        item?.let { println(it) }
    }
    //Kotlin 
//sampleEnd
}
```
{kotlin-runnable="true"}

## Safe casts (`as?`)

The regular Kotlin operator for [type casts](typecasts.md#unsafe-cast-operator) is the `as` operator. However, regular casts may result in an exception
if the object is not of the target type. 

The `as?` operator is the option to use safe casts. It tries to cast a value to the specified type and returns `null` if the value doesn't have the proper type:

```kotlin
fun main() {
// SampleStart
    // Declares a variable of type Any, which can hold any type of value
    val a: Any = "Hello, Kotlin!"

    // Safe casts to Int using 'as?' operator
    val aInt: Int? = a as? Int

    println(aInt)
    // null
// SampleEnd
}
```
{kotlin-runnable="true"}

The code above prints `null` because `a` is not an `Int`, so the cast fails safely.

## Collections of a nullable type

If you have a collection of elements of a nullable type and want to filter non-nullable elements, you can do so by using
the `filterNotNull()` function:

```kotlin
fun main() {
    // SampleStart
    // Declares a list containing some null and non-null integer values
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // Filters out null values, resulting in a list of non-null integers
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // [1, 2, 4]
    // SampleEnd
}
```
{kotlin-runnable="true"}

## What's next?

* Learn how to [handle nullability in Java and Kotlin](java-to-kotlin-nullability-guide.md).
* Learn about generic types that are [definitely non-nullable](generics.md#definitely-non-nullable-types).
