[//]: # (title: Null safety)

Null safety is a Kotlin feature designed to significantly reduce the risk of null references, also known as [The Billion-Dollar Mistake](https://en.wikipedia.org/wiki/Null_pointer#History).

One of the most common pitfalls in many programming languages, including Java, is that accessing a member of a null
reference results in a null reference exception. In Java, this would be the equivalent of a `NullPointerException`,
or an _NPE_ for short.

Kotlin explicitly supports nullability as part of its type system, meaning you can explicitly declare 
which variables or properties are allowed to be `null`. Also, when you declare non-null variables, the compiler 
enforces that these variables cannot hold a `null` value,
preventing an NPE. 

Kotlin's null safety ensures safer code by catching potential null-related issues at compile time rather than runtime. 
This feature improves code robustness, readability, and maintainability by explicitly expressing `null` values, making the code easier to understand and manage.

The only possible causes of an NPE in Kotlin are:

* An explicit call to [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/).
* Usage of the [not-null assertion operator `!!`](#not-null-assertion-operator).
* Data inconsistency during initialization, such as when:
  * An uninitialized `this` available in a constructor is used somewhere else ([a "leaking `this`"](https://youtrack.jetbrains.com/issue/KTIJ-9751)).
  * A [superclass constructor calling an open member](inheritance.md#derived-class-initialization-order) whose implementation
    in the derived class uses an uninitialized state.
* Java interoperation:
  * Attempts to access a member of a `null` reference of a [platform type](java-interop.md#null-safety-and-platform-types).
  * Nullability issues with generic types. For example, a piece of Java code adding
    `null` into a Kotlin `MutableList<String>`, which would require `MutableList<String?>` to handle it properly.
  * Other issues caused by external Java code.

> Besides NPE, another exception related to null safety is [`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/). Kotlin throws this exception 
> when you try to access a property that has not been initialized, ensuring that non-nullable properties are not used until they are ready. 
> This typically happens with [`lateinit` properties](properties.md#late-initialized-properties-and-variables).
>
{style="tip"}

## Nullable types and non-nullable types

In Kotlin, the type system distinguishes between types that can hold `null` (nullable types) and those that
cannot (non-nullable types). For example, a regular variable of type `String` cannot hold `null`:

```kotlin
fun main() {
//sampleStart
    // Assigns a non-null string to a variable
    var a: String = "abc"
    // Attempts to re-assign null to the non-nullable variable
    a = null
    print(a)
    // Null can not be a value of a non-null type String
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

You can safely call a method or access a property on `a`. It's guaranteed not to cause an NPE because `a` is a non-nullable variable.
The compiler ensures that `a` always holds a valid `String` value, so there's no risk of accessing its properties or methods when it's `null`:

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

To allow `null` values, declare a variable with a `?` sign right after the variable type. For example, 
you can declare a nullable string by writing `String?`. This expression makes `String` a type that
can accept `null`:

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    var b: String? = "abc"
    // Successfully re-assigns null to the nullable variable
    b = null
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

If you try accessing `length` directly on `b`, the compiler reports an error. This is because `b` is declared as a nullable
variable and can hold `null` values. Attempting to access properties on nullables directly leads to an NPE:

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
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

In the example above, the compiler requires you to use safe calls to check for nullability before accessing properties or 
performing operations. There are several ways to handle nullables: 

* [Check for `null` with the `if` conditional](#check-for-null-with-the-if-conditional)
* [Safe call operator `?.`](#safe-call-operator)
* [Elvis operator `?:`](#elvis-operator)
* [Not-null assertion operator `!!`](#not-null-assertion-operator)
* [Nullable receiver](#nullable-receiver)
* [`let` function](#let-function)
* [Safe casts `as?`](#safe-casts)
* [Collections of a nullable type](#collections-of-a-nullable-type)

Read the next sections for details and examples of `null` handling tools and techniques.

## Check for null with the if conditional

When working with nullable types, you need to handle nullability safely to avoid an NPE. One way to 
handle this is checking for nullability explicitly with the `if` conditional expression. 

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

In the example above, the compiler performs a [smart cast](typecasts.md#smart-casts) to change the type from nullable `String?` to non-nullable `String`. It also tracks the information about 
the check you performed and allows the call to `length` inside the `if` conditional.

More complex conditions are supported as well:

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    val b: String? = "Kotlin"

    // Checks for nullability first and then accesses length
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
        // String of length 6
    } else {
        // Provides alternative if the condition is not met
        print("Empty string")
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

Note that the example above only works when the compiler can guarantee that `b` doesn't change between the check and its usage, same as 
the [smart cast prerequisites](typecasts.md#smart-cast-prerequisites).

## Safe call operator

The safe call operator `?.` allows you to handle nullability safely in a shorter form. Instead of throwing an NPE, 
if the object is `null`, the `?.` operator simply returns `null`:

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

The `b?.length` expression checks for nullability and returns `b.length` if `b` is non-null, or `null` otherwise. The type of this expression is `Int?`.

You can use the `?.` operator with both [`var` and `val` variables](basic-syntax.md#variables) in Kotlin:

* A nullable `var` can hold a `null` (for example, `var nullableValue: String? = null`) or a non-null value (for example, `var nullableValue: String? = "Kotlin"`). If it's a non-null value, you can change it to `null` at any point.
* A nullable `val` can hold a `null` (for example, `val nullableValue: String? = null`) or a non-null value (for example, `val nullableValue: String? = "Kotlin"`). If it's a non-null value, you cannot change it to `null` subsequently.

Safe calls are useful in chains. For example, Bob is an employee who may be assigned to a department (or not). That department
may, in turn, have another employee as a department head. To obtain the name of Bob's department head (if there is one),
you write the following:

```kotlin
bob?.department?.head?.name
```

This chain returns `null` if any of its properties are `null`.

You can also place a safe call on the left side of an assignment:

```kotlin
person?.department?.head = managersPool.getManager()
```

In the example above, if one of the receivers in the safe call chain is `null`, the assignment is skipped, and the expression on the right is not evaluated at all. For example, if either
`person` or `person.department` is `null`, the function is not called. Here's the equivalent of the same safe call but with the `if` conditional:

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

## Elvis operator

When working with nullable types, you can check for `null` and provide an alternative value. For example, if `b` is not `null`,
access `b.length`. Otherwise, return an alternative value:

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Checks for nullability. If not null, returns length. If null, returns 0
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

Instead of writing the complete `if` expression, you can handle this in a more concise way with the Elvis operator `?:`:

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

## Not-null assertion operator

The not-null assertion operator `!!` converts any value to a non-nullable type.

When you apply the `!!` operator to a variable whose value is not `null`, it's safely handled as a non-nullable type, 
and the code executes normally. However, if the value is `null`, the `!!` operator forces it to be treated as non-nullable, 
which results in an NPE.

When `b` is not `null` and the `!!` operator makes it return its non-null value (which is a `String` in this example), it accesses `length` correctly:

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

When `b` is `null` and the `!!` operator makes it return its non-null value, and an NPE occurs:

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
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

The `!!` operator is particularly useful 
when you are confident that a value is not `null` and there’s no chance of getting an NPE, but the compiler cannot guarantee this due to certain rules. 
In such cases, you can use the `!!` operator to explicitly tell the compiler that the value is not `null`.

## Nullable receiver

You can use extension functions with a [nullable receiver type](extensions.md#nullable-receiver), 
allowing these functions to be called on variables that might be `null`.

By defining an extension function on a nullable receiver type, you can handle `null` values within the function itself 
instead of checking for `null` at every place where you call the function.

For example, the [`.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html) extension function 
can be called on a nullable receiver. When invoked on a `null` value, it safely returns the string `"null"` without throwing an exception:

```kotlin
//sampleStart
fun main() {
    // Assigns null to a nullable Person object stored in the person variable
    val person: Person? = null

    // Applies .toString to the nullable person variable and prints a string
    println(person.toString())
    // null
}

// Defines a simple Person class
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

In the example above, even though `person` is `null`, the `.toString()` function safely returns the string `"null"`. This can be helpful for debugging and logging.

If you expect the `.toString()` function to return a nullable string (either a string representation or `null`), use the [safe-call operator `?.`](#safe-call-operator).
The `?.` operator calls `.toString()` only if the object is not `null`, otherwise it returns `null`:

```kotlin
//sampleStart
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
//sampleEnd
```
{kotlin-runnable="true"}

The `?.` operator allows you to safely handle potential `null` values while still accessing properties or functions of objects that might be `null`.

## Let function

To handle `null` values and perform operations only on non-null types, you can use the safe call operator `?.` together with the
[`let` function](scope-functions.md#let). 

This combination is useful for evaluating an expression, check the result for `null`, and execute code only if it's not `null`, avoiding manual null checks:

```kotlin
fun main() {
//sampleStart
    // Declares a list of nullable strings
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // Iterates over each item in the list
    for (item in listWithNulls) {
        // Checks if the item is null and only prints non-null values
        item?.let { println(it) }
        //Kotlin 
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

## Safe casts

The regular Kotlin operator for [type casts](typecasts.md#unsafe-cast-operator) is the `as` operator. However, regular casts can result in an exception
if the object is not of the target type. 

You can use the `as?` operator for safe casts. It tries to cast a value to the specified type and returns `null` if the value is not of that type:

```kotlin
fun main() {
//sampleStart
    // Declares a variable of type Any, which can hold any type of value
    val a: Any = "Hello, Kotlin!"

    // Safe casts to Int using the 'as?' operator
    val aInt: Int? = a as? Int
    // Safe casts to String using the 'as?' operator
    val aString: String? = a as? String

    println(aInt)
    // null
    println(aString)
    // "Hello, Kotlin!"
//sampleEnd
}
```
{kotlin-runnable="true"}

The code above prints `null` because `a` is not an `Int`, so the cast fails safely. It also prints
`"Hello, Kotlin!"` because it matches the `String?` type, so the safe cast succeeds.

## Collections of a nullable type

If you have a collection of nullable elements and want to keep only the non-null ones, use
the `filterNotNull()` function:

```kotlin
fun main() {
//sampleStart
    // Declares a list containing some null and non-null integer values
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // Filters out null values, resulting in a list of non-null integers
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // [1, 2, 4]
//sampleEnd
}
```
{kotlin-runnable="true"}

## What's next?

* Learn how to [handle nullability in Java and Kotlin](java-to-kotlin-nullability-guide.md).
* Learn about generic types that are [definitely non-nullable](generics.md#definitely-non-nullable-types).
