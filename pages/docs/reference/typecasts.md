---
type: doc
layout: reference
category: "Syntax"
title: "Type Checks and Casts: 'is' and 'as'"
---

# Type Checks and Casts: 'is' and 'as'

## `is` and `!is` Operators

We can check whether an object conforms to a given type at runtime by using the `is` operator or its negated form `!is`:

``` kotlin
if (obj is String) {
    print(obj.length)
}

if (obj !is String) { // same as !(obj is String)
    print("Not a String")
}
else {
    print(obj.length)
}
```

## Smart Casts

In many cases, one does not need to use explicit cast operators in Kotlin, because the compiler tracks the
`is`-checks and [explicit casts](#unsafe-cast-operator) for immutable values and inserts (safe) casts automatically when needed:

``` kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x is automatically cast to String
    }
}
```

The compiler is smart enough to know a cast to be safe if a negative check leads to a return:

``` kotlin
    if (x !is String) return
    print(x.length) // x is automatically cast to String
```

or in the right-hand side of `&&` and `||`:

``` kotlin
    // x is automatically cast to string on the right-hand side of `||`
    if (x !is String || x.length == 0) return

    // x is automatically cast to string on the right-hand side of `&&`
    if (x is String && x.length > 0) {
        print(x.length) // x is automatically cast to String
    }
```

Such _smart casts_ work for [*when*{: .keyword }-expressions](control-flow.html#when-expression)
and [*while*{: .keyword }-loops](control-flow.html#while-loops) as well:

``` kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

Note that smart casts do not work when the compiler cannot guarantee that the variable cannot change between the check and the usage.
More specifically, smart casts are applicable according to the following rules:

  * *val*{: .keyword } local variables - always except for [local delegated properties](delegated-properties.html#local-delegated-properties-since-11);
  * *val*{: .keyword } properties - if the property is private or internal or the check is performed in the same module where the property is declared. Smart casts aren't applicable to open properties or properties that have custom getters;
  * *var*{: .keyword } local variables - if the variable is not modified between the check and the usage, is not captured in a lambda that modifies it, and is not a local delegated property;
  * *var*{: .keyword } properties - never (because the variable can be modified at any time by other code).


## "Unsafe" cast operator

Usually, the cast operator throws an exception if the cast is not possible. Thus, we call it *unsafe*.
The unsafe cast in Kotlin is done by the infix operator *as*{: .keyword } (see [operator precedence](grammar.html#precedence)):

``` kotlin
val x: String = y as String
```

Note that *null*{: .keyword } cannot be cast to `String` as this type is not [nullable](null-safety.html),
i.e. if `y` is null, the code above throws an exception.
In order to match Java cast semantics we have to have nullable type at cast right hand side, like:

``` kotlin
val x: String? = y as String?
```

## "Safe" (nullable) cast operator

To avoid an exception being thrown, one can use a *safe* cast operator *as?*{: .keyword } that returns *null*{: .keyword } on failure:

``` kotlin
val x: String? = y as? String
```

Note that despite the fact that the right-hand side of *as?*{: .keyword } is a non-null type `String` the result of the cast is nullable.

## Type erasure and generic type checks

Kotlin ensures type safety of operations involving [generics](generics.html) at compile time,
while, at runtime, instances of generic types hold no information about their actual type arguments. For example, 
`List<Foo>` is erased to just `List<*>`. In general, there is no way to check whether an instance belongs to a generic 
type with certain type arguments at runtime. 

Given that, the compiler prohibits *is*{: .keyword }-checks that cannot be performed at runtime due to type erasure, such as 
`ints is List<Int>` or `list is T` (type parameter). You can, however, check an instance against a [star-projected type](generics.html#star-projections):

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // The items are typed as `Any?`
}
```

Similarly, when you already have the type arguments of an instance checked statically (at compile time),
you can make an *is*{: .keyword }-check or a cast that involves the non-generic part of the type. Note that 
angle brackets are omitted in this case:

```kotlin
fun handleStrings(list: List<String>) {
    if (list is ArrayList) {
        // `list` is smart-cast to `ArrayList<String>`
    }
}
```

The same syntax with omitted type arguments can be used for casts that do not take type arguments into account: `list as ArrayList`. 

Inline functions with [reified type parameters](inline-functions.html#reified-type-parameters) have their actual type arguments
 inlined at each call site, which enables `arg is T` checks for the type parameters, but if `arg` is an instance of a 
generic type itself, *its* type arguments are still erased. Example:

<div class="sample" markdown="1">

``` kotlin
//sampleStart
inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

val somePair: Pair<Any?, Any?> = "items" to listOf(1, 2, 3)

val stringToSomething = somePair.asPairOf<String, Any>()
val stringToInt = somePair.asPairOf<String, Int>()
val stringToList = somePair.asPairOf<String, List<*>>()
val stringToStringList = somePair.asPairOf<String, List<String>>() // Breaks type safety!
//sampleEnd

fun main(args: Array<String>) {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
}
```
</div>

## Unchecked casts

As said above, type erasure makes checking actual type arguments of a generic type instance impossible at runtime, and 
generic types in the code might be connected to each other not closely enough for the compiler to ensure 
type safety. 

Even so, sometimes we have high-level program logic that implies type safety instead. For example:

```kotlin 
fun readDictionary(file: File): Map<String, *> = file.inputStream().use { 
    TODO("Read a mapping of strings to arbitrary elements.")
}

// We saved a map with `Int`s into that file
val intsFile = File("ints.dictionary")

// Warning: Unchecked cast: `Map<String, *>` to `Map<String, Int>`
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```

The compiler produces a warning for the cast in the last line. The cast cannot be fully checked at runtime and provides 
no guarantee that the values in the map are `Int`.

To avoid unchecked casts, you can redesign the program structure: in the example above, there could be interfaces
 `DictionaryReader<T>` and `DictionaryWriter<T>` with type-safe implementations for different types. 
 You can introduce reasonable abstractions to move unchecked casts from calling code to the implementation details.
 Proper use of [generic variance](generics.html#variance) can also help. 
 
For generic functions, using [reified type parameters](inline-functions.html#reified-type-parameters) makes the casts 
such as `arg as T` checked, unless `arg`'s type has *its own* type arguments that are erased.

An unchecked cast warning can be suppressed by [annotating](annotations.html#annotations) the statement or the 
declaration where it occurs with `@Suppress("UNCHECKED_CAST")`:

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

On the JVM, the [array types](basic-types.html#arrays) (`Array<Foo>`) retain the information about the erased type of 
their elements, and the type casts to an array type are partially checked: the 
nullability and actual type arguments of the elements type are still erased. For example, 
the cast `foo as Array<List<String>?>` will succeed if `foo` is an array holding any `List<*>`, nullable or not.
