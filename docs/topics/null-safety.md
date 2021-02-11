[//]: # (title: Null safety)

## Nullable types and non-null types

Kotlin's type system is aimed at eliminating the danger of null references from code, also known as the [The Billion Dollar Mistake](https://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions).

One of the most common pitfalls in many programming languages, including Java, is that accessing a member of a null 
reference will result in a null reference exception. In Java this would be the equivalent of a `NullPointerException` 
or NPE for short.

Kotlin's type system is aimed to eliminate `NullPointerException`'s from our code. The only possible causes of NPE's may be:

* An explicit call to `throw NullPointerException()`.
* Usage of the `!!` operator that is described below.
* Some data inconsistency with regard to initialization, such as when:
  * An uninitialized `this` available in a constructor is passed and used somewhere ("leaking `this`").
  * [A superclass constructor calls an open member](inheritance.md#derived-class-initialization-order) whose implementation 
  in the derived class uses uninitialized state.
* Java interoperation:
  * Attempts to access a member on a `null` reference of a [platform type](java-interop.md#null-safety-and-platform-types);
  * Generic types used for Java interoperation with incorrect nullability, for example, a piece of Java code might add 
  `null` into a Kotlin `MutableList<String>`, meaning that `MutableList<String?>` should be used for working with it.
  * Other issues caused by external Java code.

In Kotlin, the type system distinguishes between references that can hold `null` (nullable references) and those that 
cannot (non-null references).
For example, a regular variable of type `String` cannot hold `null`:

```kotlin
fun main() {
//sampleStart
    var a: String = "abc" // Regular initialization means non-null by default
    a = null // compilation error
//sampleEnd
}
```
{kotlin-runnable="true"}

To allow nulls, you can declare a variable as nullable string, written `String?`:

```kotlin
fun main() {
//sampleStart
    var b: String? = "abc" // can be set null
    b = null // ok
    print(b)
//sampleEnd
}
```
{kotlin-runnable="true"}

Now, if you call a method or access a property on `a`, it's guaranteed not to cause an NPE, so you can safely say:

```kotlin
val l = a.length
```

But if you want to access the same property on `b`, that would not be safe, and the compiler reports an error:

```kotlin
val l = b.length // error: variable 'b' can be null
```

But you still need to access that property, right? There are a few ways of doing that.

## Checking for `null` in conditions

First, you can explicitly check if `b` is `null`, and handle the two options separately:

```kotlin
val l = if (b != null) b.length else -1
```

The compiler tracks the information about the check you performed, and allows the call to `length` inside the `if`.
More complex conditions are supported as well:

```kotlin
fun main() {
//sampleStart
    val b: String? = "Kotlin"
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
    } else {
        print("Empty string")
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

Note that this only works where `b` is immutable (that means a local variable which is not modified between the check and the
usage or a member `val` which has a backing field and is not overridable), because otherwise it might
happen that `b` changes to `null` after the check.

## Safe calls

Your second option is the safe call operator, written `?.`:

```kotlin
fun main() {
//sampleStart
    val a = "Kotlin"
    val b: String? = null
    println(b?.length)
    println(a?.length) // Unnecessary safe call
//sampleEnd
}
```
{kotlin-runnable="true"}

This returns `b.length` if `b` is not null, and `null` otherwise. The type of this expression is `Int?`.

Safe calls are useful in chains. For example, if Bob, an Employee, may be assigned to a Department (or not),
that in turn may have another Employee as a department head, then to obtain the name of Bob's department head (if any), 
you write the following:

```kotlin
bob?.department?.head?.name
```

Such a chain returns `null` if any of the properties in it is `null`.

To perform a certain operation only for non-null values, you can use the safe call operator together with 
[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html):

```kotlin
fun main() {
//sampleStart
    val listWithNulls: List<String?> = listOf("Kotlin", null)
    for (item in listWithNulls) {
         item?.let { println(it) } // prints Kotlin and ignores null
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

A safe call can also be placed on the left side of an assignment. Then, if one of the receivers in the safe calls chain 
is `null`, the assignment is skipped, and the expression on the right is not evaluated at all:

```kotlin
// If either `person` or `person.department` is null, the function is not called:
person?.department?.head = managersPool.getManager()
```

## Elvis operator

When you have a nullable reference `b`, you can say "if `b` is not `null`, use it, otherwise use some non-null value":

```kotlin
val l: Int = if (b != null) b.length else -1
```

Along with the complete `if`-expression, this can be expressed with the Elvis operator, written `?:`:

```kotlin
val l = b?.length ?: -1
```

If the expression to the left of `?:` is not `null`, the elvis operator returns it, otherwise it returns the expression 
to the right.
Note that the right-hand side expression is evaluated only if the left-hand side is `null`.

Since `throw` and `return` are expressions in Kotlin, they can also be used on
the right hand side of the elvis operator. This can be very handy, for example, for checking function arguments:

```kotlin
fun foo(node: Node): String? {
    val parent = node.getParent() ?: return null
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## The `!!` operator

The third option is for NPE-lovers: the not-null assertion operator (`!!`) converts any value to a non-null
type and throws an exception if the value is `null`. You can write `b!!`, and this will return a non-null value of `b`
(for example, a `String` in our example) or throw an NPE if `b` is `null`:

```kotlin
val l = b!!.length
```

Thus, if you want an NPE, you can have it, but you have to ask for it explicitly, and it does not appear out of the blue.

## Safe casts

Regular casts may result into a `ClassCastException` if the object is not of the target type.
Another option is to use safe casts that return `null` if the attempt was not successful:

```kotlin
val aInt: Int? = a as? Int
```

## Collections of a nullable type

If you have a collection of elements of a nullable type and want to filter non-null elements, you can do so by using 
`filterNotNull`:

```kotlin
val nullableList: List<Int?> = listOf(1, 2, null, 4)
val intList: List<Int> = nullableList.filterNotNull()
```

