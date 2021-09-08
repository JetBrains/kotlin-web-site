[//]: # (title: Type checks and casts)

## is and !is operators

Use the `is` operator or its negated form `!is` to perform a runtime check that identifies whether an object conforms to a given type:

```kotlin
if (obj is String) {
    print(obj.length)
}

if (obj !is String) { // same as !(obj is String)
    print("Not a String")
} else {
    print(obj.length)
}
```

## Smart casts

In most cases, you don't need to use explicit cast operators in Kotlin because the compiler tracks the
`is`-checks and [explicit casts](#unsafe-cast-operator) for immutable values and inserts (safe) casts automatically when necessary:

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x is automatically cast to String
    }
}
```

The compiler is smart enough to know that a cast is safe if a negative check leads to a return:

```kotlin
if (x !is String) return

print(x.length) // x is automatically cast to String
```

or if it is on the right-hand side of `&&` or `||`:

```kotlin
// x is automatically cast to String on the right-hand side of `||`
if (x !is String || x.length == 0) return

// x is automatically cast to String on the right-hand side of `&&`
if (x is String && x.length > 0) {
    print(x.length) // x is automatically cast to String
}
```

Smart casts work for [`when` expressions](control-flow.md#when-expression)
and [`while` loops](control-flow.md#while-loops) as well:

```kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

Note that smart casts work only when the compiler can guarantee that the variable won't change between the check and the usage.
More specifically, smart casts can be used under the following conditions:

* `val` local variables - always, with the exception of [local delegated properties](delegated-properties.md).
* `val` properties - if the property is private or internal or if the check is performed in the same [module](visibility-modifiers.md#modules) where the property is declared. Smart casts cannot be used on open properties or properties that have custom getters.
* `var` local variables - if the variable is not modified between the check and the usage, is not captured in a lambda that modifies it, and is not a local delegated property.
* `var` properties - never, because the variable can be modified at any time by other code.

## "Unsafe" cast operator

Usually, the cast operator throws an exception if the cast isn't possible. And so, it's called *unsafe*.
The unsafe cast in Kotlin is done by the infix operator `as`.

```kotlin
val x: String = y as String
```

Note that `null` cannot be cast to `String`, as this type is not [nullable](null-safety.md).
If `y` is null, the code above throws an exception.
To make code like this correct for null values, use the nullable type on the right-hand side of the cast:

```kotlin
val x: String? = y as String?
```

## "Safe" (nullable) cast operator

To avoid exceptions, use the *safe* cast operator `as?`, which returns `null` on failure.

```kotlin
val x: String? = y as? String
```

Note that despite the fact that the right-hand side of `as?` is a non-null type `String`, the result of the cast is nullable.

## Type erasure and generic type checks

Kotlin ensures type safety for operations involving [generics](generics.md) at compile time,
while, at runtime, instances of generic types don't hold information about their actual type arguments. For example,
`List<Foo>` is erased to just `List<*>`. In general, there is no way to check whether an instance belongs to a generic
type with certain type arguments at runtime.

Because of that, the compiler prohibits `is`-checks that cannot be performed at runtime due to type erasure, such as
`ints is List<Int>` or `list is T` (type parameter). You can, however, check an instance against a [star-projected type](generics.md#star-projections):

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // The items are typed as `Any?`
}
```

Similarly, when you already have the type arguments of an instance checked statically (at compile time),
you can make an `is`-check or a cast that involves the non-generic part of the type. Note that
angle brackets are omitted in this case:

```kotlin
fun handleStrings(list: List<String>) {
    if (list is ArrayList) {
        // `list` is smart-cast to `ArrayList<String>`
    }
}
```

The same syntax but with the type arguments omitted can be used for casts that do not take type arguments into account: `list as ArrayList`.

Inline functions with [reified type parameters](inline-functions.md#reified-type-parameters) have their actual type arguments
inlined at each call site. This enables `arg is T` checks for the type parameters, but if `arg` is an instance of a
generic type itself, *its* type arguments are still erased.

```kotlin
//sampleStart
inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

val somePair: Pair<Any?, Any?> = "items" to listOf(1, 2, 3)


val stringToSomething = somePair.asPairOf<String, Any>()
val stringToInt = somePair.asPairOf<String, Int>()
val stringToList = somePair.asPairOf<String, List<*>>()
val stringToStringList = somePair.asPairOf<String, List<String>>() // Compiles but breaks type safety!
// Expand the sample for more details

//sampleEnd

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // This will throw ClassCastException as list items are not String
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Unchecked casts

As established above, type erasure makes checking the actual type arguments of a generic type instance impossible at runtime.
Additionally, generic types in the code might not be connected to each other closely enough for the compiler to ensure
type safety.

Even so, sometimes we have high-level program logic that implies type safety instead. For example:

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use {
   TODO("Read a mapping of strings to arbitrary elements.")
}

// We saved a map with `Int`s into this file
val intsFile = File("ints.dictionary")

// Warning: Unchecked cast: `Map<String, *>` to `Map<String, Int>`
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```

A warning appears for the cast in the last line. The compiler can't fully check it at runtime and provides
no guarantee that the values in the map are `Int`.

To avoid unchecked casts, you can redesign the program structure. In the example above, you could use the
`DictionaryReader<T>` and `DictionaryWriter<T>` interfaces with type-safe implementations for different types.
You can introduce reasonable abstractions to move unchecked casts from the call site to the implementation details.
Proper use of [generic variance](generics.md#variance) can also help.

For generic functions, using [reified type parameters](inline-functions.md#reified-type-parameters) makes casts
like `arg as T` checked, unless `arg`'s type has *its own* type arguments that are erased.

An unchecked cast warning can be suppressed by [annotating](annotations.md) the statement or the
declaration where it occurs with `@Suppress("UNCHECKED_CAST")`:

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

>**On the JVM**: [array types](basic-types.md#arrays) (`Array<Foo>`) retain information about the erased type of
>their elements, and type casts to an array type are partially checked: the
>nullability and actual type arguments of the element type are still erased. For example,
>the cast `foo as Array<List<String>?>` will succeed if `foo` is an array holding any `List<*>`, whether it is nullable or not.
>
{type="note"}
