---
type: doc
layout: reference
category: "Syntax"
title: "Null Safety"
---

# Null Safety

## Nullable types and Non-Null Types

Kotlin's type system is aimed at eliminating the danger of null references from code, also known as the [The Billion Dollar Mistake](https://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions).

One of the most common pitfalls in many programming languages, including Java, is that accessing a member of a null reference will result in a null reference exception. In Java this would be the equivalent of a `NullPointerException` or NPE for short.

Kotlin's type system is aimed to eliminate `NullPointerException`'s from our code. The only possible causes of NPE's may be:

* An explicit call to `throw NullPointerException()`;
* Usage of the `!!` operator that is described below;
* Some data inconsistency with regard to initialization, such as when:
  * An uninitialized *this*{: .keyword } available in a constructor is passed and used somewhere ("leaking *this*{: .keyword }"); 
  * [A superclass constructor calls an open member](classes.html#derived-class-initialization-order) whose implementation in the derived class uses uninitialized state;
* Java interoperation:
  * Attempts to access a member on a `null` reference of a [platform type](java-interop.html#null-safety-and-platform-types);
  * Generic types used for Java interoperation with incorrect nullability, e.g. a piece of Java code might add `null` into a Kotlin `MutableList<String>`, meaning that `MutableList<String?>` should be used for working with it;
  * Other issues caused by external Java code.

In Kotlin, the type system distinguishes between references that can hold *null*{: .keyword } (nullable references) and those that can not (non-null references).
For example, a regular variable of type `String` can not hold *null*{: .keyword }:

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    var a: String = "abc" // Regular initialization means non-null by default
    a = null // compilation error
//sampleEnd
}
```
</div>

To allow nulls, we can declare a variable as nullable string, written `String?`:

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    var b: String? = "abc" // can be set null
    b = null // ok
    print(b)
//sampleEnd
}
```
</div>

Now, if you call a method or access a property on `a`, it's guaranteed not to cause an NPE, so you can safely say:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val l = a.length
```
</div>

But if you want to access the same property on `b`, that would not be safe, and the compiler reports an error:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val l = b.length // error: variable 'b' can be null
```
</div>

But we still need to access that property, right? There are a few ways of doing that.

## Checking for *null*{: .keyword } in conditions

First, you can explicitly check if `b` is *null*{: .keyword }, and handle the two options separately:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val l = if (b != null) b.length else -1
```
</div>

The compiler tracks the information about the check you performed, and allows the call to `length` inside the *if*{: .keyword }.
More complex conditions are supported as well:

<div class="sample" markdown="1" theme="idea">
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
</div>

Note that this only works where `b` is immutable (i.e. a local variable which is not modified between the check and the
usage or a member *val*{: .keyword } which has a backing field and is not overridable), because otherwise it might
happen that `b` changes to *null*{: .keyword } after the check.

## Safe Calls

Your second option is the safe call operator, written `?.`:

<div class="sample" markdown="1" theme="idea">
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
</div>

This returns `b.length` if `b` is not null, and *null*{: .keyword } otherwise. The type of this expression is `Int?`.

Safe calls are useful in chains. For example, if Bob, an Employee, may be assigned to a Department (or not),
that in turn may have another Employee as a department head, then to obtain the name of Bob's department head (if any), we write the following:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
bob?.department?.head?.name
```
</div>

Such a chain returns *null*{: .keyword } if any of the properties in it is null.

To perform a certain operation only for non-null values, you can use the safe call operator together with [`let`](/api/latest/jvm/stdlib/kotlin/let.html):

<div class="sample" markdown="1" theme="idea">
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
</div>

A safe call can also be placed on the left side of an assignment. Then, if one of the receivers in the safe calls chain is null, the assignment is skipped, and the expression on the right is not evaluated at all:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
// If either `person` or `person.department` is null, the function is not called:
person?.department?.head = managersPool.getManager()
```
</div>

## Elvis Operator

When we have a nullable reference `b`, we can say "if `b` is not null, use it, otherwise use some non-null value":

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val l: Int = if (b != null) b.length else -1
```
</div>

Along with the complete *if*{: .keyword }-expression, this can be expressed with the Elvis operator, written `?:`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val l = b?.length ?: -1
```
</div>

If the expression to the left of `?:` is not null, the elvis operator returns it, otherwise it returns the expression to the right.
Note that the right-hand side expression is evaluated only if the left-hand side is null.

Note that, since *throw*{: .keyword } and *return*{: .keyword } are expressions in Kotlin, they can also be used on
the right hand side of the elvis operator. This can be very handy, for example, for checking function arguments:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun foo(node: Node): String? {
    val parent = node.getParent() ?: return null
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```
</div>

## The `!!` Operator

The third option is for NPE-lovers: the not-null assertion operator (`!!`) converts any value to a non-null
type and throws an exception if the value is null. We can write `b!!`, and this will return a non-null value of `b`
(e.g., a `String` in our example) or throw an NPE if `b` is null:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val l = b!!.length
```
</div>

Thus, if you want an NPE, you can have it, but you have to ask for it explicitly, and it does not appear out of the blue.

## Safe Casts

Regular casts may result into a `ClassCastException` if the object is not of the target type.
Another option is to use safe casts that return *null*{: .keyword } if the attempt was not successful:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val aInt: Int? = a as? Int
```
</div>

## Collections of Nullable Type

If you have a collection of elements of a nullable type and want to filter non-null elements, you can do so by using `filterNotNull`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val nullableList: List<Int?> = listOf(1, 2, null, 4)
val intList: List<Int> = nullableList.filterNotNull()
```
</div>
