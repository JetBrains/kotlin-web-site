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
    String data = "some usefull shared data";

    private Singleton() {}

    private static class LazyHolder {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return LazyHolder.INSTANCE;
    }
}

// Usage:
String data = Singleton.getInstance().data;
```

Java code above provides you with a lazy-initialised thread-safe [singleton instance](https://en.wikipedia.org/wiki/Singleton_pattern).
Kotlin [`object`](object-declarations.html#object-declarations) has the same semantics:

``` kotlin
public object Singleton {
    val data = "any usefull shared information"
}

// Usage:
val data = Singleton.data
```

### Delegate (Decorator)

``` java
interface Printer {
    void print(String msg);
}

final class HP3000 implements Printer {
    void print(String msg) {
        System.out.println(msg);
    }
}

class MyPrinter implements Printer {
    Printer p = new HP3000();

    void print(String msg) {
        p.print(msg);
    }
}

// Usage:
MyPrinter mp = new MyPrinter();
mp.print("Hello!");
```

[Delegation pattern](https://en.wikipedia.org/wiki/Delegation_pattern) allows inheriting behaviour of a class without extending it.
This is invaluable when the class, implementing the behaviour, is final.
Also this technique has no limitation on the number of delegated interfaces, thus providing a mean for [multiple inheritance](https://en.wikipedia.org/wiki/Multiple_inheritance).
Kotlin cuts the boilerplate here with its [class delegation](https://kotlinlang.org/docs/reference/delegation.html#class-delegation) syntax:

``` kotlin
// --- interface `Printer` and class `HP3000` are defined in the Java snipet above ---

class MyPrinter : Printer by HP3000()

// Usage:
val mp = MyPrinter()
mp.print("Hello!")
```

The delegate object can be a constructor parameter, allowing runtime behaviour configuration, or acting as *dependency injection*:

``` kotlin
class ConfigurablePrinter(printer: Printer = HP3000()) : Printer by printer

// Usage:
val workPrinter = ConfigurablePrinter()
workPrinter.print("Hello!")

val testPrinter = ConfigurablePrinter(printer = HP555())
testPrinter.print("test page")
```


## Obsolete patterns

Java patterns that are unnecessary in Kotlin since they can be replaced with core Kotlin features.

### Builder

``` java
class Car {
    final int year;
    final String model;

    Car(CarBuilder builder) {
        year = builder.year;
        model = builder.model;
    }
}

class CarBuilder {
    int year;
    String model = "default-model";

    void setYear(int year) {
        this.year = year;
    }

    void setModel(String model) {
        this.model = model;
    }
}

// Usage:
CarBuilder cb = new CarBuilder();
cb.setYear(1908);
cb.setModel("Model T");

Car car = new Car(cb);
```

The [builder pattern](https://en.wikipedia.org/wiki/Builder_pattern) is used to create objects with `final` fields without providing a constructor with a massive list of arguments.
Also it allows having default values for `final` fields that are optional to specify.
All of this is easily achieved in Kotlin with the [primary constructor](classes.html#constructors) syntax.
Note how using [named arguments](functions.html#named-arguments) makes the syntax well-readable even for long parameter lists:

``` kotlin
class Car(val year: Int,
          val model: String = "default-model")

// Usage:
val car = Car(year = 1908,
              model = "Model T")
```

## Enhanced patterns

Patterns that may be improved with Kotlin features.

### Factory

``` java
public class ShapeFactory {
   public static Shape getShape(String shapeType) {...}
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