---
type: doc
layout: reference
category: "Syntax"
title: "Nested and Inner Classes"
---

# Nested and Inner Classes

Classes can be nested in other classes:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

</div>

## Inner classes

A nested class marked as *inner*{: .keyword } can access the members of its outer class. Inner classes carry a reference to an object of an outer class:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

</div>

See [Qualified *this*{: .keyword } expressions](this-expressions.html) to learn about disambiguation of *this*{: .keyword } in inner classes.

## Anonymous inner classes

Anonymous inner class instances are created using an [object expression](object-declarations.html#object-expressions):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

</div>

_Note_: on the JVM, if the object is an instance of a functional Java interface (i.e. a Java interface with a single abstract method),
you can create it using a lambda expression prefixed with the type of the interface:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val listener = ActionListener { println("clicked") }
```

</div>
