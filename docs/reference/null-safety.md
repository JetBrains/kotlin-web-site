---
type: doc
layout: reference
category: "Syntax"
title: "Null Safety"
---

# Null Safety

## Nullable types and Non-Null Types

Kotlin's type system is aimed at eliminating the danger of null references from code, also known as the [The Billion Dollar Mistake](http://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions).

One of the most common pitfalls in many programming languages, including Java is that of accessing a member of a null references, resulting in null reference exceptions. In Java this
would be the equivalent of a `NullPointerException` or NPE for short.

Kotlin's type system is aimed to eliminate `NullPointerException`'s from our code. The only possible causes of NPE's may be

* An explicit call to `throw NullPointerException()`
* Usage of the `!!` operator that is described below
* External Java code has caused it
* There's some data inconsistency with regard to initialization (an uninitialized *this* available in a constructor is used somewhere)

In Kotlin, the type system distinguishes between references that can hold *null*{: .keyword } (nullable references) and those that can not (non-null references).
For example, a regular variable of type `String` can not hold *null*{: .keyword }:

``` kotlin
var a: String = "abc"
a = null // compilation error
```

To allow nulls, we can declare a variable as nullable string, written `String?`:

``` kotlin
var b: String? = "abc"
b = null // ok
```

Now, if you call a method or access a property on `a`, it's guaranteed not to cause an NPE, so you can safely say

``` kotlin
val l = a.length
```

But if you want to access the same property on `b`, that would not be safe, and the compiler reports an error:

``` kotlin
val l = b.length // error: variable 'b' can be null
```

But we still need to access that property, right? There are a few ways of doing that.

## Checking for *null*{: .keyword } in conditions

First, you can explicitly check if `b` is *null*{: .keyword }, and handle the two options separately:

``` kotlin
val l = if (b != null) b.length else -1
```

The compiler tracks the information about the check you performed, and allows the call to `length` inside the *if*{: .keyword }.
More complex conditions are supported as well:

``` kotlin
if (b != null && b.length > 0)
  print("String of length ${b.length}")
else
  print("Empty string")
```

Note that this only works where `b` is immutable (i.e. a local variable which is not modified between the check and the
usage or a member *val*{: .keyword } which has a backing field and is not overridable), because otherwise it might
happen that `b` changes to *null*{: .keyword } after the check.

## Safe Calls

Your second option is the safe call operator, written `?.`:

``` kotlin
b?.length
```
This returns `b.length` if `b` is not null, and *null*{: .keyword } otherwise. The type of this expression is `Int?`.

Safe calls are useful in chains. For example, if Bob, an Employee, may be assigned to a Department (or not),
that in turn may have another Employee as a department head, then to obtain the name of Bob's department head, if any), we write the following:

``` kotlin
bob?.department?.head?.name
```

Such a chain returns *null*{: .keyword } if any of the properties in it is null.

To perform a certain operation only for non-null values, you can use the safe call operator together with [`let`](/api/latest/jvm/stdlib/kotlin/let.html):

``` kotlin
val listWithNulls: List<String?> = listOf("A", null)
for (item in listWithNulls) {
     item?.let { println(it) } // prints A and ignores null
}
```

## Elvis Operator

When we have a nullable reference `r`, we can say "if `r` is not null, use it, otherwise use some non-null value `x`":

``` kotlin
val l: Int = if (b != null) b.length else -1
```

Along with the complete *if*{: .keyword }-expression, this can be expressed with the Elvis operator, written `?:`:

``` kotlin
val l = b?.length ?: -1
```

If the expression to the left of `?:` is not null, the elvis operator returns it, otherwise it returns the expression to the right.
Note that the right-hand side expression is evaluated only if the left-hand side is null.

Note that, since *throw*{: .keyword } and *return*{: .keyword } are expressions in Kotlin, they can also be used on
the right hand side of the elvis operator. This can be very handy, for example, for checking function arguments:

``` kotlin
fun foo(node: Node): String? {
  val parent = node.getParent() ?: return null
  val name = node.getName() ?: throw IllegalArgumentException("name expected")
  // ...
}
```

## The `!!` Operator

The third option is for NPE-lovers. We can write `b!!`, and this will return a non-null value of `b`
(e.g., a `String` in our example) or throw an NPE if `b` is null:

``` kotlin
val l = b!!.length
```

Thus, if you want an NPE, you can have it, but you have to ask for it explicitly, and it does not appear out of the blue.

## Safe Casts

Regular casts may result into a `ClassCastException` if the object is not of the target type.
Another option is to use safe casts that return *null*{: .keyword } if the attempt was not successful:

``` kotlin
val aInt: Int? = a as? Int
```

## Collections of Nullable Type

If you have a collection of elements of a nullable type and want to filter non-null elements, you can do so by using `filterNotNull`.

``` kotlin
val nullableList: List<Int?> = listOf(1, 2, null, 4)
val intList: List<Int> = nullableList.filterNotNull()
```
