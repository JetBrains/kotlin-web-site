---
type: doc
layout: reference
category: "Classes and Objects"
title: "Sealed Classes"
---

# Sealed Classes

Sealed classes are used for representing restricted class hierarchies, when a value can have one of the types from a
limited set, but cannot have any other type. They are, in a sense, an extension of enum classes: the set of values
for an enum type is also restricted, but each enum constant exists only as a single instance, whereas a subclass
of a sealed class can have multiple instances which can contain state.

To declare a sealed class, you put the `sealed` modifier before the name of the class. A sealed class can have
subclasses, but all of them must be nested inside the declaration of the sealed class itself.

``` kotlin
sealed class Expr {
    class Const(val number: Double) : Expr()
    class Sum(val e1: Expr, val e2: Expr) : Expr()
    object NotANumber : Expr()
}
```

Note that classes which extend subclasses of a sealed class (indirect inheritors) can be placed anywhere, not necessarily inside
the declaration of the sealed class.

The key benefit of using sealed classes comes into play when you use them in a [`when` expression](control-flow.html#when-expression). If it's possible
to verify that the statement covers all cases, you don't need to add an `else` clause to the statement.

``` kotlin
fun eval(expr: Expr): Double = when(expr) {
    is Expr.Const -> expr.number
    is Expr.Sum -> eval(expr.e1) + eval(expr.e2)
    Expr.NotANumber -> Double.NaN
    // the `else` clause is not required because we've covered all the cases
}
```

## Relaxed Rules for Sealed Classes (since 1.1)

### Subclasses in the Same File

Since 1.1 you can declare the subclasses of the `sealed` class on the top-level, with only restriction that they should be located in the same file as the parent class. 

### Sealed Classes and Data Classes

Data classes can extend other classes, including `sealed` classes, which makes the hierarchy more usable.

With all the newly supported features, you can rewrite the `Expr` class hierarchy in the following way:

``` kotlin
sealed class Expr
data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
}
```