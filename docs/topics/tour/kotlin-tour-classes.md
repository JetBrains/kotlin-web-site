[//]: # (title: Classes)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">Basic types</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">Collections</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">Control flow</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">Functions</a><br />
        <img src="icon-6.svg" width="20" alt="Sixth step" /> <strong>Classes</strong><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">Null safety</a></p>
</tldr>

Kotlin supports object-oriented programming with classes and objects. Objects are useful for storing data in your program.
Classes allow you to declare a set of characteristics for an object. When you create objects from a class, you can save
time and effort because you don't have to declare these characteristics every time.

To declare a class, use the `class` keyword: 

```kotlin
class Customer
```

## Properties

Characteristics of a class's object can be declared in properties. You can declare properties for a class:

* Within parentheses `()` after the class name.
```kotlin
class Contact(val id: Int, var email: String)
```

* Within the class body defined by curly braces `{}`.
```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

We recommend that you declare properties as read-only (`val`) unless they need to be changed after an instance of the class
is created.

You can declare properties without `val` or `var` within parentheses but these properties are not accessible after an 
instance has been created.

> * The content contained within parentheses `()` is called the **class header**.
> * You can use a [trailing comma](coding-conventions.md#trailing-commas) when declaring class properties.
>
{style="note"}

Just like with function parameters, class properties can have default values:
```kotlin
class Contact(val id: Int, var email: String = "example@gmail.com") {
    val category: String = "work"
}
```

## Create instance

To create an object from a class, you declare a class **instance** using a **constructor**.

By default, Kotlin automatically creates a constructor with the parameters declared in the class header.

For example:
```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-class-create-instance"}

In the example:

* `Contact` is a class.
* `contact` is an instance of the `Contact` class.
* `id` and `email` are properties.
* `id` and `email` are used with the default constructor to create `contact`.

Kotlin classes can have many constructors, including ones that you define yourself. To learn more about how to declare 
multiple constructors, see [Constructors](classes.md#constructors).

## Access properties

To access a property of an instance, write the name of the property after the instance name appended with a period `.`:

```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    
    // Prints the value of the property: email
    println(contact.email)           
    // mary@gmail.com

    // Updates the value of the property: email
    contact.email = "jane@gmail.com"
    
    // Prints the new value of the property: email
    println(contact.email)           
    // jane@gmail.com
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-access-property"}

> To concatenate the value of a property as part of a string, you can use string templates (`$`).
> For example:
> ```kotlin
> println("Their email address is: ${contact.email}")
> ```
>
{style="tip"}

## Member functions

In addition to declaring properties as part of an object's characteristics, you can also define an object's behavior 
with member functions.

In Kotlin, member functions must be declared within the class body. To call a member function on an instance, write the 
function name after the instance name appended with a period `.`. For example:

```kotlin
class Contact(val id: Int, var email: String) {
    fun printId() {
        println(id)
    }
}

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    // Calls member function printId()
    contact.printId()           
    // 1
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-member-function"}

## Data classes

Kotlin has **data classes** which are particularly useful for storing data. Data classes have the same functionality as 
classes, but they come automatically with additional member functions. These member functions allow you to easily print 
the instance to readable output, compare instances of a class, copy instances, and more. As these functions are
automatically available, you don't have to spend time writing the same boilerplate code for each of your classes.

To declare a data class, use the keyword `data`:

```kotlin
data class User(val name: String, val id: Int)
```

The most useful predefined member functions of data classes are:

| **Function**       | **Description**                                                                          |
|--------------------|------------------------------------------------------------------------------------------|
| `toString()`       | Prints a readable string of the class instance and its properties.                       |
| `equals()` or `==` | Compares instances of a class.                                                           |
| `copy()`           | Creates a class instance by copying another, potentially with some different properties. |

See the following sections for examples of how to use each function:

* [Print as string](#print-as-string)
* [Compare instances](#compare-instances)
* [Copy instance](#copy-instance)

### Print as string

To print a readable string of a class instance, you can explicitly call the `toString()` function, or use print functions 
(`println()` and `print()`) which automatically call `toString()` for you:

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    
    // Automatically uses toString() function so that output is easy to read
    println(user)            
    // User(name=Alex, id=1)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-print-string"}

This is particularly useful when debugging or creating logs.

### Compare instances

To compare data class instances, use the equality operator `==`:

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // Compares user to second user
    println("user == secondUser: ${user == secondUser}") 
    // user == secondUser: true
    
    // Compares user to third user
    println("user == thirdUser: ${user == thirdUser}")   
    // user == thirdUser: false
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-compare-instances"}

### Copy instance

To create an exact copy of a data class instance, call the `copy()` function on the instance.

To create a copy of a data class instance **and** change some properties, call the `copy()` function on the instance 
**and** add replacement values for properties as function parameters.

For example:

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // Creates an exact copy of user
    println(user.copy())       
    // User(name=Alex, id=1)

    // Creates a copy of user with name: "Max"
    println(user.copy("Max"))  
    // User(name=Max, id=1)

    // Creates a copy of user with id: 3
    println(user.copy(id = 3)) 
    // User(name=Alex, id=3)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-copy-instance"}

Creating a copy of an instance is safer than modifying the original instance because any code that relies on the
original instance isn't affected by the copy and what you do with it.

For more information about data classes, see [Data classes](data-classes.md).

The last chapter of this tour is about Kotlin's [null safety](kotlin-tour-null-safety.md).

## Practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true"}

Define a data class `Employee` with two properties: one for a name, and another for a salary. Make sure that the property
for salary is mutable, otherwise you won’t get a salary boost at the end of the year! The main function demonstrates how
you can use this data class.

|---|---|
```kotlin
// Write your code here

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-1"}

|---|---|
```kotlin
data class Employee(val name: String, var salary: Int)

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-classes-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true"}

Declare the additional data classes that are needed for this code to compile.

|---|---|
```kotlin
data class Person(val name: Name, val address: Address, val ownsAPet: Boolean = true)
// Write your code here
// data class Name(...)

fun main() {
    val person = Person(
        Name("John", "Smith"),
        Address("123 Fake Street", City("Springfield", "US")),
        ownsAPet = false
    )
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-2"}

|---|---|
```kotlin
data class Person(val name: Name, val address: Address, val ownsAPet: Boolean = true)
data class Name(val first: String, val last: String)
data class Address(val street: String, val city: City)
data class City(val name: String, val countryCode: String)

fun main() {
    val person = Person(
        Name("John", "Smith"),
        Address("123 Fake Street", City("Springfield", "US")),
        ownsAPet = false
    )
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-classes-solution-2"}

### Exercise 3 {initial-collapse-state="collapsed" collapsible="true"}

To test your code, you need a generator that can create random employees. Define a `RandomEmployeeGenerator` class with 
a fixed list of potential names (inside the class body). Configure the class with a minimum and maximum salary (inside 
the class header). In the class body, define the `generateEmployee()` function. Once again, the main function demonstrates
how you can use this class.

> In this exercise, you import a package so that you can use the [`Random.nextInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/next-int.html) function.
> For more information about importing packages, see [Packages and imports](packages.md).
>
{type = "tip"}

<deflist collapsible="true" id="kotlin-tour-classes-exercise-3-hint-1">
    <def title="Hint 1">
        Lists have an extension function called <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html"><code>.random()</code></a>
        that returns a random item within a list.
    </def>
</deflist>

<deflist collapsible="true" id="kotlin-tour-classes-exercise-3-hint-2">
    <def title="Hint 2">
        <code>Random.nextInt(from = ..., until = ...)</code> gives you a random <code>Int</code> number within specified limits.
    </def>
</deflist>

|---|---|
```kotlin
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

// Write your code here

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-3"}

|---|---|
```kotlin
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

class RandomEmployeeGenerator(var minSalary: Int, var maxSalary: Int) {
    val names = listOf("John", "Mary", "Ann", "Paul", "Jack", "Elizabeth")
    fun generateEmployee() =
        Employee(names.random(),
            Random.nextInt(from = minSalary, until = maxSalary))
}

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-classes-solution-3"}

## Next step

[Null safety](kotlin-tour-null-safety.md)
