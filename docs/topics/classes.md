[//]: # (title: Classes)

Like other object-oriented languages, Kotlin uses _classes_ to encapsulate data (properties) and behavior (functions)
for reusable, structured code.

Classes are blueprints or templates for objects, which you 
create via [constructors](#constructors-and-initializer-blocks). 
When you [create an instance of a class](#creating-instances-of-classes), you are creating 
a concrete object based on that blueprint.

Kotlin offers a concise syntax for declaring classes. To declare a class, use the `class` keyword 
followed by the class name:

```kotlin
class Person { /*...*/ }
```

The class declaration consists of: 
* **Class header**, including but not limited to:
  * `class` keyword
  * Class name
  * Type parameters (if any)
  * [Primary constructor](#primary-constructor) (optional)
* **Class body** (optional), surrounded by curly braces `{}`, and including **class members** such as:
  * [Secondary constructors](#secondary-constructors)
  * [Initializer blocks](#initializer-blocks)
  * [Functions](functions.md)
  * [Properties](properties.md)
  * [Nested and inner classes](nested-classes.md)
  * [Object declarations](object-declarations.md)

Both the class header and class body can be minimal. 
If the class does not have a body, you can omit the curly braces `{}`:

```kotlin
// Class with primary constructor, but without a body 
class Person(val name: String, var age: Int)
```

Here's an example of a class with a header, body, and an [instance created](#creating-instances-of-classes) from it:

```kotlin
// Person class with a primary constructor 
// that nitializes the name property
class Person(val name: String) {
    // Class body with age property
    var age: Int = 0
}

fun main() {
    // Creates an instance of Person class by calling the constructor
    val person = Person("Alice")

    // Accesses the instance's properties
    println(person.name)
    // Alice
    println(person.age)
    // 0
}
```
{kotlin-runnable="true"}

## Creating instances of classes

An instance is created
when you use the class as a blueprint to build a real object to work with in your program.

To create an instance of a class, use the class name followed by parentheses (`()`), similar to calling a [function](functions.md):

```kotlin
// Creates an instance of the Person class
val person1 = Person()
```

In Kotlin, you can create instances:

* **Without arguments** (`()`): creates an instance using the default values, if they are declared in the class.
* **With arguments** (`(value)`): creates an instance by passing specific values.

You can assign the created instance to a mutable (`var`) or read-only (`val`) [variable](basic-syntax.md#variables):

```kotlin
// Creates an instance using the default value 
// and assigns it to a mutable variable
var person1 = Person()

// Creates an instance by passing a specific value 
// and assigns it to a read-only variable
val person2 = Person("Joe")
```

It's possible to create instances wherever you need them, inside the [`main()` function](basic-syntax.md#program-entry-point), within other functions, or inside another class.
Additionally, you can create instances inside another function and call that function from `main()`.

The following code declares a `Person` class with a property for storing a name. 
It also demonstrates
how to create an instance with both the default constructor's value and a specific value:

```kotlin
// Class header with a primary constructor 
// that initializes name with a default value
class Person(val name: String = "Sebastian")

fun main() {
    // Creates an instance using the default constructor's value
    val person1 = Person()

    // Creates an instance by passing a specific value
    val person2 = Person("Joe")

    // Accesses the instances' name property
    println(person1.name)
    // Sebastian
    println(person2.name)
    // Joe
}
```
{kotlin-runnable="true"}

> In Kotlin, unlike other object-oriented programming languages such as Java,
> there is no need for the `new` keyword when creating class instances.
>
{style="note"}

For information about creating instances of nested, inner, and anonymous inner classes,
see the [Nested classes](nested-classes.md) section.

When creating class instances, you call one of its constructors and provide arguments for the constructor parameters.
For more details, see the next section about [Constructors and initializer blocks](#constructors-and-initializer-blocks).

## Constructors and initializer blocks

A class in Kotlin can have a [_primary constructor_](#primary-constructor) and one or more [_secondary constructors_](#secondary-constructors).

The primary constructor is the main way to initialize a class; you declare it in the class header.
A secondary constructor provides additional initialization logic; you declare it in the class body.

Both primary and secondary constructors are optional, and at least one constructor should be declared in a class.

### Primary constructor

The primary constructor sets up the initial state of an instance when [it is created](#creating-instances-of-classes).

To declare a primary constructor, place it in the class header after the class name:

```kotlin
class Person constructor(name: String) { /*...*/ }
```

If the primary constructor does not have any annotations or [visibility modifiers](visibility-modifiers.md#constructors), 
you can omit the `constructor` keyword:

```kotlin
class Person(name: String) { /*...*/ }
```

The primary constructor can declare parameters as properties. Use the `val` keyword before the argument name to declare a read-only property 
and the `var` keyword for a mutable property:

```kotlin
class Person(val name: String, var age: Int) { /*...*/ }
```

These constructor parameter properties are stored as part of the instance and are accessible from outside the class. 
It's also possible to declare primary constructor parameters only, not stored in the instance, and available only within the class body:

```kotlin
// Primary constructor parameter that is also a property
class Person2(val name: String) {
    fun greet() {
        println("Hello, $name")
    }
}

// Primary constructor parameter only (not stored as a property)
class Person1(name: String) {
    // Must be assigned to a property to be usable later
    val n: String = name
    
    fun greet() {
        println("Hello, $n")
    }
}
```

Properties declared in the primary constructor are accessible to
[member functions](functions.md) of a class:

```kotlin
// Class with a primary constructor declaring properties
class Person(val name: String, var age: Int) {
    // Member function accessing class properties
    fun introduce(): String {
        return "Hi, I'm $name and I'm $age years old."
    }
}
```

You can also assign default values to properties in the primary constructor:

```kotlin
class Person(val name: String = "John", var age: Int = 30) { /*...*/ }
```

If no value is passed during [instance creation](#creating-instances-of-classes), the property uses the default value:

```kotlin
// Class with a primary constructor 
// including default values for name and age
class Person(val name: String = "John", var age: Int = 30)

fun main() {
    // Creates an instance using default values
    val person = Person()
    println("Name: ${person.name}, Age: ${person.age}")
    // Name: John, Age: 30
}
```
{kotlin-runnable="true"}

Use the primary constructor parameters to initialize additional class properties directly in the class body:

```kotlin
// Class with a primary constructor 
// including default values for name and age
class Person(
    val name: String = "John",
    var age: Int = 30
) {
    // description property initialized in the class body 
    // using the primary constructor parameters
    val description: String = "Name: $name, Age: $age"
}

fun main() {
    // Creates an instance of the Person class
    val person = Person()
    // Accesses the description property
    println(person.description)
    // Name: John, Age: 30
}
```
{kotlin-runnable="true"}

As with functions, you can use [trailing comma](coding-conventions.md#trailing-commas) in constructor declarations:

```kotlin
class Person(
    val name: String,
    val lastName: String,
    var age: Int,
) { /*...*/ }
```

### Initializer blocks

The purpose of the primary constructor is to initialize the class and set its
properties. In most cases, this initialization doesn’t require complex code.

If you need to run complex code blocks when the primary constructor is executed during [instance creation](#creating-instances-of-classes), 
use _initializer blocks_ inside the class body.

Declare initializer blocks with the `init` keyword followed by curly braces `{}`. 
Write within the curly braces any code that you want to run during initialization:

```kotlin
// Class with a primary constructor that initializes name and age
class Person(val name: String, var age: Int) {
    init {
        // Initializer block executed when an instance is created
        println("Person created: $name, age $age.")
        // Person created: John, age 30.
    }
}

fun main() {
    // Creates an instance of the Person class
    Person("John", 30)
}
```
{kotlin-runnable="true"}

Add as many initializer blocks (`init {}`) as you need. They run in the order in which they appear in the class body, 
interleaved with property initializers:

```kotlin
//sampleStart
// Class with a primary constructor that initializes name and age
class Person(val name: String, var age: Int) {
    // First initializer block
    init {
        // Runs first when an instance is created
        println("Person created: $name, age $age.")
        // Person created: John, age 30.
    }

    // Second initializer block
    init {
        // Runs after the first initializer block
        if (age < 18) {
            println("$name is a minor.")
        } else {
            println("$name is an adult.")
            // John is an adult.
        }
    }
}

fun main() {
    // Creates an instance of the Person class
    Person("John", 30)
}
//sampleEnd
```
{kotlin-runnable="true"}

You can use the primary constructor parameters in the initializer blocks. For example, in the code above, the first and second initializers use
the `name` and `age` parameters from the primary constructor. 

A common use of `init` blocks is data validation. For example, by calling the [`require` function](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/require.html):

```kotlin
class Person(val age: Int) {
    init {
        require(age > 0, "age must be positive")
    }
}
```

### Secondary constructors

In Kotlin, a secondary constructor is an additional constructor that a class can have beyond its primary constructor. 
Secondary constructors allow you to provide different ways to initialize an instance when the primary constructor alone 
isn't enough.

Secondary constructors are useful for [Java interoperability](java-to-kotlin-interop.md) and when
you need multiple ways to initialize a class.

To declare a secondary constructor, use the `constructor`
keyword inside the class body with the constructor parameters within parentheses. Use curly braces with the constructor logic inside:

```kotlin
// Class header with a primary constructor that initializes name and age
class Person(val name: String, var age: Int) {

    // Secondary constructor that takes a String age
    // and converts it to an integer
    constructor(name: String, age: String) : this(name, age.toIntOrNull() ?: 0) {
        println("$name created with converted age: $age")
        // Bob created with converted age: 8
    }
}

fun main() {
    // Uses the secondary constructor with a String age
    Person("Bob", "8")
}
```
{kotlin-runnable="true"}

> The expression `age.toIntOrNull() ?: 0` converts the `age` string to an integer. For more information about this expression, see [Null safety](null-safety.md).
>
{style="tip"}

In the code above, the secondary constructor delegates to the primary constructor via the `this` keyword, 
passing `name` and the `age` value converted to an integer.

In Kotlin, secondary constructors must delegate to the primary constructor. This delegation ensures that all primary 
constructor initialization logic is executed before any secondary constructor logic runs. 

Constructor delegation can be: 
* **Direct**, where the secondary constructor calls the primary constructor immediately.
* **Indirect**, where one secondary constructor calls another, which in turn delegates to the primary constructor.

Here's an example demonstrating how direct and indirect delegation works:

```kotlin
// Class header with a primary constructor that initializes name and age
class Person(
    val name: String,
    var age: Int
) {
    // Secondary constructor with direct delegation 
    // to the primary constructor
    constructor(name: String) : this(name, 0) {
        println("Person created with default age: $age and name: $name.")
        // Person created with default age: 0 and name: Alice.
        // Person created with default age: 0 and name: Bob.
    }

    // Secondary constructor with indirect delegation: 
    // this("Bob") -> constructor(name: String) -> primary constructor
    constructor() : this("Bob") {
        println("New person created with default age: $age and name: $name.")
        // New person created with default age: 0 and name: Bob.
    }
}

fun main() {
    // Creates an instance based on the direct delegation
    Person("Alice")

    // Creates an instance based on the indirect delegation
    Person()
}
```
{kotlin-runnable="true"}

In classes with initializer blocks (`init {}`), the code within these blocks becomes part of the primary constructor.
Given that secondary constructors delegate to the primary constructor first, all initializer blocks
and property initializers run before the body of the secondary constructor. Even if the class has no primary constructor, 
the delegation still happens implicitly:

```kotlin
// Class header with no primary constructor
class Person {
    // Initializer block executed when an instance is created
    init {
        // Runs before the secondary constructor
        println("1. First initializer block runs")
        // 1. First initializer block runs
    }

    // Secondary constructor that takes an integer parameter
    constructor(i: Int) {
        // Runs after the initializer block
        println("2. Person $i is created")
        // 2. Person 1 created
    }
}

fun main() {
    // Creates an instance of the Person class
    Person(1)
}
```
{kotlin-runnable="true"}

If there's a class that does not declare any constructors (primary or secondary), it will have an implicit primary constructor
with no parameters:

```kotlin
// Class with no explicit constructors
class Person {
    // No primary or secondary constructors declared
}

fun main() {
    // Creates an instance of the Person class 
    // using the implicit primary constructor
    val person = Person()
}
```

The visibility of this implicit primary constructor is public, meaning it can be accessed from anywhere.
If you don't want your class to have a public constructor, declare an empty primary constructor with non-default visibility:

```kotlin
class Person private constructor() { /*...*/ }
```

> On the JVM, if all primary constructor parameters have default values, the compiler implicitly provides 
> a parameterless constructor that uses those default values. 
> 
> This makes it easier to use Kotlin with libraries such as [Jackson](https://github.com/FasterXML/jackson) 
> or [Spring Data JPA](https://spring.io/projects/spring-data-jpa), which create class instances through 
> parameterless constructors.
>
> In the following example, Kotlin implicitly provides a parameterless constructor `Person()` that uses the default value `""`:
> 
> ```kotlin
> class Person(val personName: String = "")
> ```
>
{style="note"}

## Inheritance

Class inheritance in Kotlin allows you to create a new class (derived class) from an existing class (base class), 
inheriting its properties and functions while adding or modifying behavior.

> For detailed information about inheritance hierarchies and the use of the `open` keyword, see the [Inheritance](inheritance.md) section.
> 
{style="note"}

## Abstract classes

An abstract class in Kotlin is a class that cannot be instantiated directly and is designed to be inherited 
by other classes. 

An abstract class can declare abstract properties and functions, which must be implemented 
by subclasses.

Abstract classes can also have constructors. 
These constructors initialize class properties and enforce required parameters for subclasses.
Declare an abstract class using the `abstract` modifier:

```kotlin
abstract class Person(val name: String, val age: Int)
```

An abstract class can have both abstract and non-abstract members (properties and functions). 
To declare a member as abstract, you must use the `abstract` keyword explicitly. 

Abstract members do not have an implementation 
in the abstract class. To provide one, you declare an `override` function 
in the subclass or inheriting class:

```kotlin
// Abstract class with a primary constructor that declares name and age
abstract class Person(
    val name: String,
    val age: Int
) {
    // Abstract member 
    // Doesn't provide implementation, must be implemented by subclasses
    abstract fun introduce()

    // Non-abstract member (has an implementation)
    fun greet() {
        println("Hello, my name is $name.")
        // Hello, my name is Alice.
    }
}

// Subclass that provides an implementation for the abstract member
class Student(
    name: String,
    age: Int,
    val school: String
) : Person(name, age) {
    override fun introduce() {
        println("I am $name, $age years old, and I study at $school.")
        // I am Alice, 20 years old, and I study at Engineering University.
    }
}

fun main() {
    // Creates an instance of the Student class
    val student = Student("Alice", 20, "Engineering University")
    // Calls the non-abstract member
    student.greet()
    // Calls the overridden abstract member
    student.introduce()
}
```
{kotlin-runnable="true"}

You don't need to annotate abstract classes or functions with the `open` keyword because they are implicitly 
open and designed to be inherited. 

[For more details about the `open` keyword, see Inheritance](inheritance.md#open-keyword).

## Companion objects

In Kotlin, a [companion object](object-declarations.md#companion-objects) is a type of object declaration 
that allows you to access its members using the class name without needing an object from the class.

Suppose you need to write a function that can be called without creating an instance of a class, but it is still logically 
connected to the class (such as a factory function). In that case, you can declare it inside a companion [object declaration](object-declarations.md) within the class:

```kotlin
// Class with a primary constructor that declares the name property
class Person(
    val name: String
) {
    // Class body with a companion object
    companion object {
        fun createAnonymous() = Person("Anonymous")
    }
}

fun main() {
    // Calls the function without creating an instance of the class
    val anonymous = Person.createAnonymous()
    println(anonymous.name)
    // Anonymous
}
```
{kotlin-runnable="true"}

If you declare `companion object` inside your class,
you can access its members using only the class name as a qualifier.

> [See further details about companion objects here](object-declarations.md#companion-objects).
>
{style="note"}