[//]: # (title: Interfaces)

Interfaces in Kotlin can contain declarations of abstract methods, as well as method
implementations. What makes them different from abstract classes is that interfaces cannot store a state. They can have
properties, but these need to be abstract or provide accessor implementations.

An interface is defined using the keyword `interface`:

```kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // optional body
    }
}
```

## Implementing interfaces

A class or object can implement one or more interfaces:

```kotlin
class Child : MyInterface {
    override fun bar() {
        // body
    }
}
```

## Properties in interfaces

You can declare properties in interfaces. A property declared in an interface can either be abstract or provide
implementations for accessors. Properties declared in interfaces can't have backing fields, and therefore accessors
declared in interfaces can't reference them:

```kotlin
interface MyInterface {
    val prop: Int // abstract

    val propertyWithImplementation: String
        get() = "foo"

    fun foo() {
        print(prop)
    }
}

class Child : MyInterface {
    override val prop: Int = 29
}
```

## Interfaces Inheritance

An interface can derive from other interfaces, meaning it can both provide implementations for their members and declare new
functions and properties. Quite naturally, classes implementing such an interface are only required to define
the missing implementations:

```kotlin
interface Named {
    val name: String
}

interface Person : Named {
    val firstName: String
    val lastName: String
    
    override val name: String get() = "$firstName $lastName"
}

data class Employee(
    // implementing 'name' is not required
    override val firstName: String,
    override val lastName: String,
    val position: Position
) : Person
```

## Resolving overriding conflicts

When you declare many types in your supertype list, you may inherit more than one implementation of the same method:

```kotlin
interface A {
    fun foo() { print("A") }
    fun bar()
}

interface B {
    fun foo() { print("B") }
    fun bar() { print("bar") }
}

class C : A {
    override fun bar() { print("bar") }
}

class D : A, B {
    override fun foo() {
        super<A>.foo()
        super<B>.foo()
    }

    override fun bar() {
        super<B>.bar()
    }
}
```

Interfaces *A* and *B* both declare functions *foo()* and *bar()*. Both of them implement *foo()*, but only *B* implements
*bar()* (*bar()* is not marked as abstract in *A*, because this is the default for interfaces if the function has no body).
Now, if you derive a concrete class *C* from *A*, you have to override *bar()* and provide an implementation.

However, if you derive *D* from *A* and *B*, you need to implement all the methods that you have
inherited from multiple interfaces, and you need to specify how exactly *D* should implement them. This rule applies
both to methods for which you've inherited a single implementation (*bar()*) and to those for which you've inherited multiple implementations (*foo()*).
