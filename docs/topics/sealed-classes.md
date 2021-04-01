[//]: # (title: Sealed classes)

_Sealed_ classes and interfaces represent restricted class hierarchies that provide more control over inheritance.
All subclasses of a sealed class are known at compile time. No other subclasses may appear after
a module with the sealed class is compiled. For example, third-party clients can't extend your sealed class in their code.
Thus, each instance of a sealed class has a type from a limited set that is known when this class is compiled.

The same works for sealed interfaces and their implementations: once a module with a sealed interface is compiled,
no new implementations can appear.

In some sense, sealed classes are similar to [`enum`](enum-classes.md) classes: the set of values
for an enum type is also restricted, but each enum constant exists only as a _single instance_, whereas a subclass
of a sealed class can have _multiple_ instances, each with its own state.

To declare a sealed class or interface, put the `sealed` modifier before its name.

```kotlin
sealed interface Expr

sealed class MathExpr(): Expr

data class Const(val number: Double) : MathExpr()
data class Sum(val e1: Expr, val e2: Expr) : MathExpr()
object NotANumber : Expr
```

A sealed class is [abstract](classes.md#abstract-classes) by itself, it cannot be instantiated directly and can have `abstract` members.

Constructors of sealed classes can have one of two [visibilities](visibility-modifiers.md): `protected` (by default) or
`private`.

```kotlin
sealed class MathExpr {
    constructor() { /*...*/ } // protected by default
    private constructor(vararg operands: Number): this() { /*...*/ } // private is OK
    // public constructor(s: String): this() {} // Error: public and internal are not allowed
}
```


## Location of direct subclasses

Direct subclasses of sealed classes and interfaces must be declared in the same package. They may be top-level or nested
inside any number of other named classes, named interfaces, or named objects. Subclasses can have any [visibility](visibility-modifiers.md)
as long as they are compatible with normal inheritance rules in Kotlin.

Subclasses of sealed classes must have a proper qualified name. They can't be local nor anonymous objects.

> `enum` classes can't extend a sealed class (as well as any other class), but they can implement sealed interfaces.
>
{type="note"}

## Sealed classes and when expression

The key benefit of using sealed classes comes into play when you use them in a [`when`](control-flow.md#when-expression)
expression. 
If it's possible to verify that the statement covers all cases, you don't need to add an `else` clause to the statement. 
However, this works only if you use `when` as an expression (using the result) and not as a statement.

```kotlin
fun eval(expr: Expr): Double = when(expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
    // the `else` clause is not required because we've covered all the cases
}
```

> `when` expressions on [`expect`](mpp-connect-to-apis.md) sealed classes in the common code of multiplatform projects still 
> require an `else` branch. This happens because subclasses of `actual` platform implementations aren't known in the 
> common code.
>
{type="note"}