[//]: # (title: Classes)

Like other object-oriented languages, Kotlin uses _classes_ to encapsulate data (properties) and behavior (functions)
for reusable, structured code.

Classes are blueprints or templates for objects, which you 
create via [constructors](#constructors-and-initializer-blocks). When you [create an instance of a class](#creating-objects-of-classes), you are creating 
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

Here's an example of a class with header, body, and an [object created](#creating-objects-of-classes) in the `main()` function:

```kotlin
// Class with a primary constructor that initializes the 'name' property
class Person(val name: String) {
    // Class body with `age` property
    var age: Int = 0
}

fun main() {
    // Creates an object of the Person class by calling the constructor
    val person = Person("Alice")

    // Access the object's properties
    println(person.name)
    // Alice
    println(person.age)
    // 0
}
```
{kotlin-runnable="true"}

In this example, the `Person` class is defined with a primary constructor that declares a read-only property 
`name` of type `String`. In the body, the class includes a mutable `age` property initialized to `0`. 

This class represents a person with a fixed name and an age you can update after 
object creation. An object is created
when you use the class as a blueprint to build a real thing you can work with in your program. 

To create an object of a class, 
you must provide arguments for the constructor parameters. For more details, see the section [Creating objects of classes](#creating-objects-of-classes).

Both the class header and class body can be minimal. If the class does not have a body, you can omit the curly braces `{}`:

```kotlin
// Class with name and primary constructor, but without body
class Person(val name: String, var age: Int)
```

## Constructors and initializer blocks

A class in Kotlin can have a [_primary constructor_](#primary-constructor), which is optional but commonly used; and one or more [_secondary constructors_](#secondary-constructors), 
which are also optional.

The primary constructor is the main way to initialize a class, and you have to declare it in the class header. 
The secondary constructor provides additional initialization logic, and you have to declare it in the class body.

### Primary constructor

The primary constructor is the main way to initialize a class, 
setting up the initial state of an object when [it is created](#creating-objects-of-classes).

Let's see examples of primary constructors and objects created based on them.

To declare a primary constructor, use the class header after the class name:

```kotlin
class Person constructor(name: String) { /*...*/ }
```

In this example, the primary constructor initializes the class `Person` by defining a parameter `name` of type `String`.

If the primary constructor does not have any annotations or [visibility modifiers](visibility-modifiers.md#constructors), 
you can omit the `constructor` keyword:

```kotlin
class Person(name: String) { /*...*/ }
```

You can define simple properties directly in the primary constructor. To declare a read-only property, 
use the `val` keyword in the parentheses before the argument name. 
For a mutable property, use the `var` keyword:

```kotlin
class Person(val name: String, var age: Int) { /*...*/ }
```

In this example, the `Person` class has a primary constructor with two properties: `name` and `age`. 
The `name` property is declared as read-only using `val`, while the `age` property is declared as mutable using `var`, meaning that
the value of `age` can change later on.
Both properties are initialized directly when an object of `Person` [is created](#creating-objects-of-classes).

By declaring class properties in the primary constructor using `val` or `var`, you make them accessible to 
[functions](functions.md) that are members of a class:

```kotlin
// Class with a primary constructor defining properties
class Person(val name: String, var age: Int) {
    // Member function accessing class properties
    fun introduce(): String {
        return "Hi, I'm $name and I'm $age years old."
    }
}
```

Let's create an object of the `Person` class. Since the class defines a primary constructor with two parameters (`name` and `age`), 
you need to pass arguments for them when creating the object. 

Call the class's constructor using the class name followed by parentheses, and pass the corresponding 
arguments for `name` and `age` in the parentheses:

```kotlin
val person = Person("Alice", 30)
```

The previous statement creates an object of the `Person` class by calling its constructor with `"Alice"` and `30` as arguments.
Together with the class, it works like this: 

```kotlin
// Class with a primary constructor defining properties
class Person(val name: String, var age: Int) {
    // Member function accessing class properties
    fun introduce(): String {
        return "Hi, I'm $name, and I'm $age years old."
    }
}

fun main() {
    // Creates an object of the 'Person' class
    val person = Person("Alice", 25)

    // Calls the function
    println(person.introduce()) 
    // Hi, I'm Alice, and I'm 25 years old.
}
```
{kotlin-runnable="true"}

[For more details, see the section Creating objects of classes](#creating-objects-of-classes).

Additionally, you can use a [trailing comma](coding-conventions.md#trailing-commas) when declaring many class properties:

```kotlin
class Person(
    val name: String,
    val lastName: String,
    var age: Int,
) { /*...*/ }
```

Using the previous code example, if you [create an object](#creating-objects-of-classes) of the `Person`
class by passing values for `name`, `lastName`, and `age`, you get:

```kotlin
// Class with a primary constructor that initializes 'name', 'lastName', and 'age'
class Person(
    val name: String,
    val lastName: String,
    var age: Int,
)

fun main() {
    // Creates an object of the 'Person' class with given values
    val person = Person("John", "Doe", 30)

    // Accesses properties of the object
    println("${person.name} ${person.lastName} is ${person.age} years old.")
    // John Doe is 30 years old.
}
```
{kotlin-runnable="true"}

You can also assign values to properties in the primary constructor:

```kotlin
class Person(val name: String = "John", var age: Int = 30) { /*...*/ }
```

Assigning values in primary constructors ensures that if no values are passed during [object creation](#creating-objects-of-classes), the property uses the default values:

```kotlin
// Class with a primary constructor including default values for 'name' and 'age'
class Person(val name: String = "John", var age: Int = 30)

fun main() {
    // Creates an object using default values
    val person = Person()
    println("Name: ${person.name}, Age: ${person.age}")
    // Name: John, Age: 30
}
```
{kotlin-runnable="true"}

Also, you can use the primary constructor parameters to initialize additional class properties directly in the class body:

```kotlin
// Class with a primary constructor including values for 'name' and 'age'
class Person(val name: String = "John", var age: Int = 30) {
    // Property 'description' initialized using the primary constructor
    val description: String = "Name: $name, Age: $age"
}
```

In this example, the primary constructor `(val name: String = "John", var age: Int = 30)` initializes the class's properties 
and sets their initial values. Then, `description` is an additional string property, 
initialized in the class body by accessing the class properties.

Here's the same example with an [object created](#creating-objects-of-classes):

```kotlin
// Class with a primary constructor including values for 'name' and 'age'
class Person(
    val name: String = "John",
    var age: Int = 30
) {
    // Property 'description' initialized using the primary constructor
    val description: String = "Name: $name, Age: $age"
}

fun main() {
    // Create an instance of the 'Person' class
    val person = Person()
    // Accesses the 'description' property from the 'person' object
    println(person.description)
    // Name: John, Age: 30
}
```
{kotlin-runnable="true"}

### Initializer blocks

The primary constructor can't contain runnable code. Its purpose is to initialize classes and set class 
properties. For any logic or behavior that requires actual code execution, you need to place it somewhere else.

If you want to run some code during [object creation](#creating-objects-of-classes), use _initializer blocks_ inside the class body.

Declare initializer blocks with the `init` keyword followed by curly braces `{}`. Write any code that you want to run
within the curly braces:

```kotlin
// Class with a primary constructor that initializes 'name' and 'age'
class Person(val name: String, var age: Int) {
    init {
        // Initializer block executed when an object is created
        println("Person created: $name, age $age")
    }
}
```

In the example above, after the class declaration, there's an initializer block (`init {}`) containing runnable code 
to print a message that uses the class properties.

Considering the same code example, if you [create an object](#creating-objects-of-classes) of the `Person` class
by passing values for `name` and `age`, the output is:

```kotlin
//sampleStart
// Class with a primary constructor that initializes 'name' and 'age'
class Person(val name: String, var age: Int) {
    init {
        // Initializer block executed when an object is created
        println("Person created: $name, age $age.")
        // Person created: John, age 30.
    }
}

fun main() {
    // Creates an object of the 'Person' class
    Person("John", 30)
}
//sampleEnd
```
{kotlin-runnable="true"}

You can add as many initializer blocks (`init {}`) as you need, and they will be executed in the order in which they appear in the class body, 
interleaved with property initializers.

Here's an example of a class with two initializer blocks containing logic that runs when the [object is created](#creating-objects-of-classes). In this case,
the object of the `Person` class is created by passing values for `name` and `age`:

```kotlin
//sampleStart
// Class with a primary constructor that initializes 'name' and 'age'
class Person(val name: String, var age: Int) {
    // First initializer block
    init {
        // Runs first when an object is created
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
    // Creates an object of the 'Person' class
    Person("John", 30)
}
//sampleEnd
```
{kotlin-runnable="true"}

You can use the primary constructor parameters in the initializer blocks. For example, in the code above, the first and second initializers use
the `name` and `age` parameters from the primary constructor. 

### Secondary constructors

In Kotlin, a secondary constructor is an additional constructor that a class can have beyond its primary constructor. 
Secondary constructors allow you to provide different ways to initialize an object when the primary constructor alone 
isn't enough.

Secondary constructors are useful for [Java interoperability](java-to-kotlin-interop.md) and when
you need multiple ways to initialize a class.

To declare a secondary constructor, use the `constructor`
keyword inside the class body. After the keyword, add the constructor parameters within parenthesis. 
Then, use curly braces with the constructor logic inside:

```kotlin
// Class header with primary constructor that initializes 'name' and 'age'
class Person(val name: String, var age: Int) {
    // Class body with secondary constructor
    constructor(name: String) : this(name, 0) { /*...*/ }
}
```

See secondary constructors in action. The following code snippet [creates an object](#creating-objects-of-classes)
`Person("Bob")` based on the secondary constructor. The secondary constructor assigns a default age (`8`) and takes the 
`name` parameter. The constructor logic prints a message when the secondary constructor is called:

```kotlin
// Class header with primary constructor that initializes 'name' and 'age'
class Person(val name: String, var age: Int) {
    // Secondary constructor that takes a String age and converts it
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

In the code above, the secondary constructor calls or delegates to the primary constructor via the [`this` keyword](this-expressions.md), 
passing `name` and the default value of `age`.

In Kotlin, secondary constructors must delegate to the primary constructor. This delegation ensures that all primary 
constructor initialization logic is executed before any secondary constructor logic runs. 

Constructor delegation can be: 
* **Direct**, where the secondary constructor calls the primary constructor immediately.
* **Indirect**, where one secondary constructor calls another, which in turn delegates to the primary constructor.

Here's an example demonstrating how direct and indirect delegation works:

```kotlin
// Class header with primary constructor that initializes 'name' and 'age'
class Person(val name: String, var age: Int) {
    // Secondary constructor with direct delegation to the primary constructor
    constructor(name: String) : this(name, 0) {
        println("Person created with default name: $name")
    }

    // Secondary constructor with indirect delegation: 'this("Bob")' -> 'constructor(name: String)' -> primary constructor
    constructor() : this("Bob") {
        println("New person created with default name: $name")
    }
}
```

The same code example with two [objects created](#creating-objects-of-classes), one for the direct delegation and the other for
the indirect delegation, looks like this:

```kotlin
// Class header with primary constructor that initializes 'name' and 'age'
class Person(
    val name: String,
    var age: Int
) {
    // Secondary constructor with direct delegation to the primary constructor
    constructor(name: String) : this(name, 0) {
        println("Person created with default age: $age and name: $name.")
        // Person created with default age: 0 and name: Alice.
        // Person created with default age: 0 and name: Bob.
    }

    // Secondary constructor with indirect delegation: 'this("Bob")' -> 'constructor(name: String)' -> primary constructor
    constructor() : this("Bob") {
        println("New person created with default age: $age and name: $name.")
        // New person created with default age: 0 and name: Bob.
    }
}

fun main() {
    // Creates an object based on the direct delegation
    Person("Alice")

    // Creates an object based on the indirect delegation
    Person()
}
```
{kotlin-runnable="true"}

In classes with initializer blocks (`init {}`), the code within these blocks becomes part of the primary constructor.
When a secondary constructor is invoked, it delegates to the primary constructor first. As a result, all initializer blocks
and property initializers run before the body of the secondary constructor. 

Whenever an [object of a class is created](#creating-objects-of-classes), all initializer blocks run before any secondary constructor logic.
Even if the class has no primary constructor, the delegation still happens implicitly, and the initializer blocks are
still executed:

```kotlin
//sampleStart
// Class header with no primary constructor
class Person {
    // Initializer block executed when an object is created
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
    // Creates an object of the 'Person' class using the secondary constructor
    Person(1)
}
//sampleEnd
```
{kotlin-runnable="true"}

When the `Person(1)` object is created, the initializer block (`init {}`) executes first, followed by the secondary constructor's print statement.

If there's a class that is a [non-abstract class](#abstract-classes) and does not declare any constructors (primary or secondary), it will have an implicit primary constructor
with no arguments:

```kotlin
// Class with no explicit constructors
class Person {
    // No primary or secondary constructors declared
}

fun main() {
    // Creates an object of the 'Person' class using the implicit primary constructor
    val person = Person()
}
```

The visibility of the constructor will be public, meaning it can be accessed from anywhere.
If you don't want your class to have a public constructor, declare an empty primary constructor with non-default visibility:

```kotlin
class Person private constructor() { /*...*/ }
```

> On the JVM, if all primary constructor parameters have default values, the compiler implicitly provides 
> a parameterless constructor that uses those default values. 
> 
> This makes it easier to use Kotlin with libraries such as [Jackson](https://github.com/FasterXML/jackson) 
> or [Spring Data JPA](https://spring.io/projects/spring-data-jpa), which create class objects through 
> parameterless constructors.
>
> In the following example, Kotlin implicitly provides a parameterless constructor `Person()` that uses the default value `""`:
> 
> ```kotlin
> class Person(val personName: String = "")
> ```
>
{style="note"}

## Creating objects of classes

Like in other object-oriented programming languages, a class in Kotlin serves as a blueprint or template 
that defines the properties (attributes) and behaviors (functions) of objects. When you create an instance 
of a class, you are creating a concrete object based on that blueprint.

To create an object of a class, use the class name followed by parentheses (`()`), similar to calling a function:

```kotlin
// Creates an object of the 'Person' class
val person1 = Person()
```

In Kotlin, you can create objects:

* **Without arguments** (`()`): creates an object using a constructor with default values.
* **With arguments** (`("value")`): creates an object by passing specific values to the constructor.

As you can see, you can assign the created object to a mutable (`var`) or immutable (`val`) [variable](basic-syntax.md#variables):

```kotlin
// Creates an object by passing a specific value and assigns it to a mutable variable
var person2 = Person("Joe")

// Creates an object using the default constructor's value and assigns it to an immutable variable
val person1 = Person()
```

You can create objects wherever you need them, inside the `main()` function, within other functions, or as part of a class. 

When creating objects inside the `main()` function, when the program runs, execution starts from `main()`. 
Here is where you instantiate objects to interact with them. When creating objects of a class, you're invoking constructors 
(for example, `Person()` or `Person("Joe")`) directly inside the `main()` function.

Let's look at an example of how object creation works.

The following code defines a `Person` class with a property for storing a name. 
When an object of the class is created, an initialization block runs to print a message. The example demonstrates 
creating an object with both the default constructor's value and a specific value:

```kotlin
// Class header with primary constructor that initializes 'name' with a default value
class Person(val name: String = "Sebastian")

fun main() {
    // Creates an object using the default constructor's value
    val person1 = Person()
    println("Person object created: ${person1.name}")
    // Person object created: Sebastian

    // Creates an object by passing a specific value
    val person2 = Person("Joe")
    println("Person object created: ${person2.name}")
    // Person object created: Joe
}
```
{kotlin-runnable="true"}

> In Kotlin, unlike other object-oriented programming languages like Java, 
> there is no need for the `new` keyword when creating objects of a class.
>
{style="note"}

Additionally, you can create objects inside another function and call that function from `main()`.

For information about creating objects of nested, inner, and anonymous inner classes,
see the [Nested classes](nested-classes.md) section.

## Inheritance

Class inheritance in Kotlin allows you to create a new class (derived class) from an existing class (base class), 
inheriting its properties and functions while adding or modifying behavior.

> For detailed information about inheritance hierarchies and the use of the `open` keyword, see the [Inheritance](inheritance.md) section.
> 
{style="note"}

## Abstract classes

An abstract class in Kotlin is a class that cannot be instantiated directly and is designed to be inherited 
by other classes. 

An abstract class can define abstract properties and functions, which must be implemented 
by subclasses.

You can declare an abstract class using the `abstract` modifier:

```kotlin
abstract class Person
```

Like any other class, abstract classes can also have constructors. 
These constructors initialize class properties and enforce required parameters for subclasses:

```kotlin
abstract class Person(val name: String, val age: Int)
```

An abstract class can have both abstract and non-abstract members (properties and functions). 
To declare a member as abstract, you must use the `abstract` keyword explicitly.

Abstract members do not have an implementation in the abstract class. The `override`
keyword ensures that a subclass provides an actual implementation for an abstract function:

```kotlin
// Abstract class with a primary constructor that defines 'name' and 'age'
abstract class Person(
    val name: String,
    val age: Int
) {
    // Abstract member (doesn't provide default implementation, must be implemented by subclasses)
    abstract fun introduce()

    // Non-abstract member (has a default implementation)
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
    // Creates an object of the Student class
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

If you need to write a function that can be called without creating an object of a class but still needs access to the 
class's companion object members, you can define it inside an [object declaration](object-declarations.md) within the class:

```kotlin
// Class with a primary constructor that defines the 'name' property
class Person(
    val name: String
) {
    // Class body with a companion object
    companion object {
        fun createAnonymous() = Person("Anonymous")
    }
}

fun main() {
    // Calls the function without creating an object of the class
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