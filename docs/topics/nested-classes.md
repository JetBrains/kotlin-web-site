[//]: # (title: Nested and inner classes)

Classes can be nested in other classes:

```kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

You can also use interfaces with nesting. All combinations of classes and interfaces are possible: You can nest interfaces
in classes, classes in interfaces, and interfaces in interfaces.

```kotlin
interface OuterInterface {
    class InnerClass
    interface InnerInterface
}

class OuterClass {
    class InnerClass
    interface InnerInterface
}
```

## Inner classes

A nested class marked as `inner` can access the members of its outer class. Inner classes carry a reference to an object of an outer class:

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

See [Qualified `this` expressions](this-expressions.md) to learn about disambiguation of `this` in inner classes.

## Anonymous inner classes

Anonymous inner class instances are created using an [object expression](object-declarations.md#object-expressions):

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

> On the JVM, if the object is an instance of a functional Java interface (that means a Java interface with a single 
> abstract method), you can create it using a lambda expression prefixed with the type of the interface:
>
>```kotlin
> val listener = ActionListener { println("clicked") }
> ```
>
{type="note"}

