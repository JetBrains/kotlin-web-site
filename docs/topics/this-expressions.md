[//]: # (title: This expressions)

To denote the current _receiver_, you use `this` expressions:

* In a member of a [class](classes.md#inheritance), `this` refers to the current object of that class.
* In an [extension function](extensions.md) or a [function literal with receiver](lambdas.md#function-literals-with-receiver)
`this` denotes the _receiver_ parameter that is passed on the left-hand side of a dot.

If `this` has no qualifiers, it refers to the _innermost enclosing scope_. To refer to `this` in other scopes, _label qualifiers_ are used:

## Qualified `this` 

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
                val d = this // funLit's receiver
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

## Implicit `this`

When you call a member function on `this`, you can skip the `this.` part.
If you have a non-member function with the same name, use this with caution because in some cases it can be called instead:

```kotlin
fun main() {
//sampleStart
    fun printLine() { println("Top-level function") }
    
    class A {
        fun printLine() { println("Member function") }

        fun invokePrintLine(omitThis: Boolean = false)  { 
            if (omitThis) printLine()
            else this.printLine()
        }
    }
    
    A().invokePrintLine() // Member function
    A().invokePrintLine(omitThis = true) // Top-level function
//sampleEnd()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

