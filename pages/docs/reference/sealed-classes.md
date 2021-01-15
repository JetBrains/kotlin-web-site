---
type: doc
layout: reference
category: "Classes and Objects"
title: "Sealed Classes"
---

# Sealed Classes

> **Sealed interfaces** are [Experimental](evolution/components-stability.html). They may be dropped or changed at any time.
> Opt-in is required (see details [below](#experimental-status-of-sealed-interfaces)). Use them only for evaluation purposes. We appreciate your feedback on them in [YouTrack](https://youtrack.jetbrains.com/issues/KT-20423).
{:.note}

_Sealed_ classes and interfaces represent restricted class hierarchies that provide more control over inheritance. 
All subclasses of a sealed class are known at compile time. No other subclasses may appear after
a module with the sealed class is compiled. For example, third-party clients can't extend your sealed class in their code.

The same works for sealed interfaces and their implementations: once a module with a sealed interface is compiled, 
no new implementations can appear.

Thus, instances of sealed classes can have one of the types from a limited set closed for further extension.

In some sense, sealed classes are similar to enum classes: the set of values
for an enum type is also restricted, but each enum constant exists only as a _single instance_, whereas a subclass
of a sealed class can have _multiple_ instances, each with its own state.

To declare a sealed class or interface, put the `sealed` modifier before its name.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
sealed interface Expr

sealed class MathExpr(): Expr

data class Const(val number: Double) : MathExpr()
data class Sum(val e1: Expr, val e2: Expr) : MathExpr()
object NotANumber : Expr
```
</div>

A sealed class is [abstract](classes.html#abstract-classes) by itself, it cannot be instantiated directly and can have *abstract*{: .keyword } members.

Sealed classes are not allowed to have non-*private*{: .keyword } constructors (their constructors are *private*{: .keyword } by default).

## Inheritance rules

Direct subclasses of sealed classes and interfaces must be declared in the same package. They may be top-level or nested 
inside any number of other named classes, named interfaces, or named objects. Subclasses can have any [visibility](visibility-modifiers.html)
as long as they are otherwise compatible with normal inheritance rules in Kotlin.

Subclasses of sealed classes must have a proper qualified name. They can't be local nor anonymous objects.

Subclasses of sealed classes are `final` by default.

> `enum` classes can't extend a sealed class (as well as any other class) but they can implement sealed interfaces.
{:.note}


## Sealed classes and when expression

The key benefit of using sealed classes comes into play when you use them in a [`when` expression](control-flow.html#when-expression). If it's possible
to verify that the statement covers all cases, you don't need to add an `else` clause to the statement.
However, this works only if you use `when` as an expression (using the result) and not as a statement.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun eval(expr: Expr): Double = when(expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
    // the `else` clause is not required because we've covered all the cases
}
```
</div>

## Experimental status of sealed interfaces

Sealed **interfaces** are [Experimental](evolution/components-stability.html). To be able to use sealed interfaces in
your code, switch to the language version `1.5`:
* In Gradle, add the [compiler option](using-gradle.html#attributes-common-for-jvm-and-js) `languageVersion` with the value `1.5`.

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlinOptions.languageVersion = "1.5"
```

</div>  

* In the command-line compiler, add the option `-language-version 1.5`.

Note that this does not apply to sealed **classes**. They are stable since Kotlin 1.0.