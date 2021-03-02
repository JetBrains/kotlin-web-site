[//]: # (title: Sealed classes)

_Sealed_ classes represent restricted class hierarchies that provide more control over inheritance.
All subclasses of a sealed class are known at compile time. No other subclasses may appear after
a module with the sealed class is compiled. For example, third-party clients can't extend your sealed class in their code.
Thus, each instance of a sealed class has a type from a limited set that is known when this class is compiled.

In some sense, sealed classes are similar to [`enum` classes](enum-classes.md): the set of values
for an enum type is also restricted, but each enum constant exists only as a _single instance_, whereas a subclass
of a sealed class can have _multiple_ instances, each with its own state.

To declare a sealed class, put the `sealed` modifier before its name.

```kotlin
sealed class Expr
data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()
```

A sealed class is [abstract](classes.md#abstract-classes) by itself, it cannot be instantiated directly and can have `abstract` members.

Sealed classes are not allowed to have non-`private` constructors (their constructors are `private` by default).

## Sealed interfaces

> Sealed interfaces are [Experimental](components-stability.md). They may be dropped or changed at any time.
> Opt-in is required (see the details [below](#try-sealed-interfaces-and-package-wide-hierarchies-of-sealed-classes)), and you should use them only for evaluation purposes.  We would appreciate your feedback on them in [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433).
>
{type="warning"}

Interfaces can be declared `sealed` as well as classes. The `sealed` modifier works on interfaces the same way:
all implementations of a sealed interface are known at compile time. Once a module with a sealed interface is compiled,
no new implementations can appear.

```kotlin
sealed interface Expr

sealed class MathExpr(): Expr

data class Const(val number: Double) : MathExpr()
data class Sum(val e1: Expr, val e2: Expr) : MathExpr()
object NotANumber : Expr
```

## Location of direct subclasses

All direct subclasses of a sealed class must be declared in the same file as this class itself. Classes that extend
direct subclasses of a sealed class (indirect inheritors) can be placed anywhere, not necessarily in the same file.

### Additional location: the same package

> Package-wide hierarchies of sealed classes are [Experimental](components-stability.md). They may be dropped or changed at any time.
> Opt-in is required (see the details [below](#try-sealed-interfaces-and-package-wide-hierarchies-of-sealed-classes)), and you should use them only for evaluation purposes.  We would appreciate your feedback on them in [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433).
>
{type="warning"}

Direct subclasses of sealed classes and interfaces must be declared in the same package. They may be top-level or nested
inside any number of other named classes, named interfaces, or named objects. Subclasses can have any [visibility](visibility-modifiers.html)
as long as they are compatible with normal inheritance rules in Kotlin.

Subclasses of sealed classes must have a proper qualified name. They can't be local nor anonymous objects.

> `enum` classes can't extend a sealed class (as well as any other class), but they can implement sealed interfaces.
>
{type="note"}

## Sealed classes and when expression

The key benefit of using sealed classes comes into play when you use them in a [`when` expression](control-flow.md#when-expression). 
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

## Try sealed interfaces and package-wide hierarchies of sealed classes

[Sealed interfaces](#sealed-interfaces) and [package-wide hierarchies](#additional-location-the-same-package) are [Experimental](components-stability.md).
To be able to use them in your code, switch to the language version `1.5`:

* In Gradle, add the [compiler option](gradle.md#compiler-option-attributes) `languageVersion` with the value `1.5`.

  ```groovy
  kotlinOptions.languageVersion = "1.5"
  ```
  
* In the command-line compiler, add the option `-language-version 1.5`.