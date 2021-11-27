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

or if it is on the right-hand side of `&&` or `||` and the proper check (regular or negative) is on the left-hand side:

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

## Generics type checks and casts

Please see the corresponding section in the [generics documentation page](generics.md#generics-type-checks-and-casts)
for information on which type checks and casts you can perform with generics.
