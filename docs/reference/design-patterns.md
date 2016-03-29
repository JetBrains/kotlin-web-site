---
type: doc
layout: reference
category: "Basics"
title: "Design Patterns"
---

# Design Patterns

This is a list of Java design patterns that should be implemented differently in Kotlin than in Java.
Design patterns that are the same for Kotlin and Java are not listed here.


## Natively supported patterns

Patterns that have dedicated Kotlin syntax for their support.

### Singleton

``` java
public class Singleton {
    String info = "any usefull shared information";

    private Singleton() {}

    private static class LazyHolder {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return LazyHolder.INSTANCE;
    }
}

// Usage:
String info = Singleton.getInstance().info;
```

Java code above provides you with a lazy-initialised thread-safe [singleton instance](https://en.wikipedia.org/wiki/Singleton_pattern).
Kotlin [`object`](object-declarations.html#object-declarations) has the same semantics:

``` kotlin
public object Singleton {
    val info = "any usefull shared information"
}

// Usage:
val info = Singleton.info
```


## Obsolete patterns

Java patterns that are unnecessary in Kotlin since they can be replaced with core Kotlin features.


## Enhanced patterns

Patterns that may be improved with Kotlin features.

### Factory

``` java
public class ShapeFactory {
   public Shape getShape(String shapeType){...}
}

// Usage:
ShapeFactory shapeFactory = new ShapeFactory();
Shape shape1 = shapeFactory.getShape("CIRCLE");
```

Instead of a [factory class](https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)) use a top-level factory function named the same as the interface it produces:

``` kotlin
public fun Shape(String shapeType): Shape {...}

// Usage:
val shape = Shape("CIRCLE")
```



## Kotlin patterns

Kotlin patterns that do not have analogues in Java.