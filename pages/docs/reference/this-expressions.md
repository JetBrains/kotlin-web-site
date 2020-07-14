---
type: doc
layout: reference
category: "Syntax"
title: "This expressions"
---

# This Expression

To denote the current _receiver_, we use *this*{: .keyword } expressions:

* In a member of a [class](classes.html#inheritance), *this*{: .keyword } refers to the current object of that class.
* In an [extension function](extensions.html) or a [function literal with receiver](lambdas.html#function-literals-with-receiver)
*this*{: .keyword } denotes the _receiver_ parameter that is passed on the left-hand side of a dot.

If *this*{: .keyword } has no qualifiers, it refers to the _innermost enclosing scope_. To refer to *this*{: .keyword } in other scopes, _label qualifiers_ are used:

## Qualified *this*{: .keyword }
{:#qualified}

To access *this*{: .keyword } from an outer scope (a [class](classes.html), or [extension function](extensions.html),
or labeled [function literal with receiver](lambdas.html#function-literals-with-receiver)) we write `this@label` where `@label` is a [label](returns.html)
on the scope *this*{: .keyword } is meant to be from:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

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

</div>

## Implicit `this`

When you call a member function on `this`, you can skip the `this.` part.
If you have a non-member function with the same name, use this with caution, because in some cases it can be called instead:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

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
</div>
