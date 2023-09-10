[//]: # (title: Type checks and casts)

In Kotlin, you can perform type checks to check the type of an object at runtime. Type casts convert objects to a 
different type.

> To learn specifically about **generics** type checks and casts, for example `List<T>`, `Map<K,V>`, see [Generics type checks and casts](generics.md#generics-type-checks-and-casts).
>
{type="tip"}

## is and !is operators

Use the `is` operator or its negated form `!is` to perform a runtime check that identifies whether an object conforms to a given type:

```kotlin
if (obj is String) {
    print(obj.length)
}

if (obj !is String) { // Same as !(obj is String)
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

Or if it is on the right-hand side of `&&` or `||` and the proper check (regular or negative) is on the left-hand side:

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

> Note that smart casts work only when the compiler can guarantee that the variable won't change between the check and its usage.
>
{type="warning"}

Smart casts can be used in the following conditions:

<table header-style="none">
        <tr>
        <td>
            <code>val</code> local variables
        </td>
        <td>
            Always, except <a href="delegated-properties.md">local delegated properties</a>.
        </td>
    </tr>
        <tr>
        <td>
            <code>val</code> properties
        </td>
        <td>
            If the property is <code>private</code>, <code>internal</code>, or if the check is performed in the same <a href="visibility-modifiers.md#modules">module</a> where the property is declared. Smart casts can't be used on <code>open</code> properties or properties that have custom getters.
        </td>
    </tr>
        <tr>
        <td>
            <code>var</code> local variables
        </td>
        <td>
            If the variable is not modified between the check and its usage, is not captured in a lambda that modifies it, and is not a local delegated property.
        </td>
    </tr>
        <tr>
        <td>
            <code>var</code> properties
        </td>
        <td>
            Never, because the variable can be modified at any time by other code.
        </td>
    </tr>
</table>

## "Unsafe" cast operator

Usually, the cast operator throws an exception if the cast isn't possible. Thus, it's called _unsafe_.
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

Note that despite the fact that the right-hand side of `as?` is a non-nullable type `String`, the result of the cast is nullable.
