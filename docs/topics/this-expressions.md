[//]: # (title: This expressions)

To denote the current _receiver_, you use `this` expressions:

* In a member of a [class](classes.md#inheritance), `this` refers to the current object of that class.
* In an [extension function](extensions.md) or a [function literal with receiver](lambdas.md#function-literals-with-receiver)
`this` denotes the _receiver_ parameter that is passed on the left-hand side of a dot.

If `this` has no qualifiers, it refers to the _innermost enclosing scope_. To refer to `this` in other scopes, _label qualifiers_ are used:

## Qualified this 

To access `this` from an outer scope (a [class](classes.md), [extension function](extensions.md),
or labeled [function literal with receiver](lambdas.md#function-literals-with-receiver)) you write `this@label`,
 where `@label` is a [label](returns.md) on the scope `this` is meant to be from:

```kotlin
class A { // implicit label @A
    inner class B { // implicit label @B
        fun Int.foo() { // implicit label @foo
            val a = this@A // A's this
            val b = this@B // B's this

            val c = this // foo()'s receiver, an Int
            val c1 = this@foo // foo()'s receiver, an Int

            val funLit = lambda@ fun String.() {
                val d = this // funLit's receiver, a String
            }

            val funLit2 = { s: String ->
                // foo()'s receiver, since enclosing lambda expression
                // doesn't have any receiver
                val d1 = this
            }
        }
    }
}
```

## Implicit this

When you call a member function on `this`, you can omit the `this.` qualifier.
However, if another callable with the same name is available in a closer lexical scope, Kotlin resolves
the unqualified call to that callable instead of the member function. To explicitly call the member function,
use the `this.` qualifier:

```kotlin
fun main() {
    class A {
        fun printLine() {
            println("Member function")
        }

        fun invokePrintLine() {
            fun printLine() {
                println("Local function")
            }
         
            printLine()
            // Local function
         
            this.printLine()
            // Member function
        }
    }

    A().invokePrintLine()
}
```
{kotlin-runnable="true"}