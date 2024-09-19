[//]: # (title: Object expressions and declarations)

Sometimes you need to use singletons for shared resources,
create factory methods to efficiently instantiate objects,
or modify the behavior of an existing class without explicitly declaring a new subclass.
Kotlin handles these needs with _object expressions_ and _object declarations_.

Object expressions and object declarations are best used for scenarios when:

* **Using singletons for shared resources:** You need to ensure that only one instance of a class exists throughout the application.
For example, managing a database connection pool.
* **Creating factory methods:** You need a convenient way to create instances efficiently.
[Companion objects](#companion-objects) allow you to define class-level methods and properties tied to a class, simplifying the creation and management of these instances.
* **Modifying existing class behavior temporarily:** You want to modify the behavior of an existing class without creating a new subclass.
For example, adding temporary functionality to an object for a specific operation.
* **Limited class inheritance is desired:** You need to create single instances of classes without creating subclasses,
such as for event listeners or callbacks. This ensures only one instance exists throughout the application.
* **Type-safe design is required:** You require one-time implementations of interfaces or abstract classes using object expressions.
This can be useful for scenarios like a button click handler.

## Object expressions

_Object expressions_ create objects of anonymous classes, which are classes not explicitly declared with the `class`
declaration. Such classes are useful for one-time use. You can define them from scratch, inherit from existing classes,
or implement interfaces. Instances of anonymous classes are also called _anonymous objects_ because they are defined by
an expression, not a name.

### Create anonymous objects from scratch

Object expressions start with the `object` keyword.

If you just need an object that doesn't have any nontrivial supertypes, write its members in curly braces after `object`:

```kotlin
fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // object expressions extend Any, so `override` is required on `toString()`
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // Hello World
//sampleEnd
}
```
{kotlin-runnable="true"}

### Inherit anonymous objects from supertypes

To create an object of an anonymous class that inherits from some type (or types), specify this type after `object` and a
colon (`:`). Then implement or override the members of this class as if you were [inheriting](inheritance.md) from it:

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

If a supertype has a constructor, pass appropriate constructor parameters to it.
Multiple supertypes can be specified as a comma-delimited list after the colon:

```kotlin
//sampleStart
// Creates an open class BankAccount with a balance property
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// Defines an interface Transaction with an execute() method
interface Transaction {
    fun execute()
}

// Function to perform a special transaction on a BankAccount
fun specialTransaction(account: BankAccount) {
    // Creates an anonymous class inheriting from BankAccount and implementing Transaction
    // The balance of the provided account is passed to the BankAccount superclass constructor
    val temporaryAccount = object : BankAccount(account.balance), Transaction {

        override val balance = account.balance + 500  // Temporary bonus

        // Implements the execute() method from the Transaction interface
        override fun execute() {
            println("Executing special transaction. New balance is $balance.")
        }
    }
    // Executes the transaction
    temporaryAccount.execute()
}
//sampleEnd
fun main() {
    // Creates a BankAccount with an initial balance of 1000
    val myAccount = BankAccount(1000)
    // Performs a special transaction on the created account
    specialTransaction(myAccount)
    // 1500
}
```
{kotlin-runnable="true"}

### Use anonymous objects as return and value types

When you use an anonymous object as the type for a local or [private](visibility-modifiers.md#packages) function or property (but not an [inline function](inline-functions.md)),
all its members are accessible through that function or property:

```kotlin
//sampleStart
class UserPreferences {
    private fun getPreferences() = object {
        val theme: String = "Dark"
        val fontSize: Int = 14
    }

    fun printPreferences() {
        val preferences = getPreferences()
        println("Theme: ${preferences.theme}, Font Size: ${preferences.fontSize}")
    }
}
//sampleEnd

fun main() {
    val userPreferences = UserPreferences()
    userPreferences.printPreferences()
}
```
{kotlin-runnable="true"}

If this function or property is `public` or `private` inline, its actual type is:

* `Any` if the anonymous object doesn't have a declared supertype
* The declared supertype of the anonymous object, if there is exactly one such type
* The explicitly declared type if there is more than one declared supertype

In all these cases, members added in the anonymous object are not accessible. Overridden members are accessible if they
are declared in the actual type of the function or property:

```kotlin
//sampleStart
interface Notification {
    // Declares notifyUser() in the Notification interface
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // The return type is Any; message is not accessible
    // When the return type is Any, only members of Any are accessible.
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // The return type is Notification; notifyUser() is accessible because it's declared in Notification
    // The message property is not accessible because it is not declared in the Notification interface
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // The return type is DetailedNotification; notifyUser() and message are not accessible
    // Only members declared in the DetailedNotification interface are accessible
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}
//sampleEnd
fun main() {
    val notificationManager = NotificationManager()
    // No output

    // The message property is not accessible here because the return type is Any
    val notification = notificationManager.getNotification()
    // No output

    // The notifyUser() is accessible
    // The message property is not accessible here because the return type is Notification
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // Sending email notification

    // The notifyUser() method and message property are not accessible here because the return type is DetailedNotification
    val detailedNotification = notificationManager.getDetailedNotification()
    // No output
}
```
{kotlin-runnable="true"}

### Access variables from anonymous objects

The code in object expressions can access variables from the enclosing scope:

```kotlin
fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // The clickCount and enterCount variables are accessible within the object expression
}
```

## Object declarations
{id="object-declarations-overview"}

The [Singleton](https://en.wikipedia.org/wiki/Singleton_pattern) pattern can be useful in several cases,
and Kotlin makes it easy to declare singletons:

```kotlin
//sampleStart
// Declares a Singleton object to manage data providers
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // Registers a new data provider
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // Retrieves all registered data providers
    val allDataProviders: Collection<DataProvider> 
        get() = providers
}
//sampleEnd

// Example data provider interface
interface DataProvider {
    fun provideData(): String
}

// Example data provider implementation
class ExampleDataProvider : DataProvider {
    override fun provideData(): String {
        return "Example data"
    }
}

fun main() {
    // Creates an instance of ExampleDataProvider
    val exampleProvider = ExampleDataProvider()

    // To refer to the object, use its name directly
    DataProviderManager.registerDataProvider(exampleProvider)

    // Retrieves and prints all data providers
    println(DataProviderManager.allDataProviders.map { it.provideData() })
}
```
{kotlin-runnable="true"}

This is called an _object declaration_, and it always has a name following the `object` keyword.
Just like a variable declaration, an object declaration is not an expression, and it cannot be used on the right-hand side
of an assignment statement.

The initialization of an object declaration is thread-safe and done on first access.

To refer to the object, use its name directly:

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

Object declarations can also have supertypes,
similar to how [anonymous classes can inherit from existing classes or implement interfaces](#inheriting-anonymous-objects-from-supertypes):

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

> Object declarations cannot be local, which means they cannot be nested directly inside a function. 
> However, they can be nested within other object declarations or non-inner classes.
>
{type="note"}

### Data objects

When printing a plain object declaration in Kotlin, the string representation contains both its name and the hash of the object:

```kotlin
object MyObject

fun main() {
    println(MyObject) 
    // MyObject@1f32e575
}
```
{kotlin-runnable="true"}

Just like [data classes](data-classes.md), you can mark an `object` declaration with the `data` modifier. 
This instructs the compiler to generate a number of functions for your object:

* `toString()` returns the name of the data object
* `equals()`/`hashCode()` pair

  > You can't provide a custom `equals` or `hashCode` implementation for a `data object`.
  >
  {type="note"}

The `toString()` function of a data object returns the name of the object:

```kotlin
data object MyDataObject {
    val number: Int = 3
}

fun main() {
    println(MyDataObject) 
    // MyDataObject
}
```
{kotlin-runnable="true"}

The `equals()` function for a `data object` ensures that all objects that have the type of your `data object` are considered equal.
In most cases, you will only have a single instance of your data object at runtime (after all, a `data object` declares a singleton).
However, in the edge case where another object of the same type is generated at runtime (for example, by using platform 
reflection with `java.lang.reflect` or a JVM serialization library that uses this API under the hood), this ensures that 
the objects are treated as being equal.

> Make sure that you only compare `data objects` structurally (using the `==` operator) and never by reference (using the `===` operator).
> This helps you to avoid pitfalls when more than one instance of a data object exists at runtime.
>
{type="warning"}

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) 
    // MySingleton

    println(evilTwin) 
    // MySingleton

    // Even when a library forcefully creates a second instance of MySingleton, its `equals` method returns true:
    println(MySingleton == evilTwin) // true

    // Do not compare data objects via ===
    println(MySingleton === evilTwin) // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin reflection does not permit the instantiation of data objects.
    // This creates a new MySingleton instance "by force" (i.e. Java platform reflection)
    // Don't do this yourself!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

The generated `hashCode()` function has behavior that is consistent with the `equals()` function, so that all runtime 
instances of a `data object` have the same hash code.

#### Differences between data objects and data classes

While `data object` and `data class` declarations are often used together and have some similarities, there are some 
functions that are not generated for a `data object`:

* No `copy()` function. Because a `data object` declaration is intended to be used as singleton objects, no `copy()` 
  function is generated. The singleton pattern restricts the instantiation of a class to a single instance, which would 
  be violated by allowing copies of the instance to be created.
* No `componentN()` function. Unlike a `data class`, a `data object` does not have any data properties. 
  Since attempting to destructure such an object without data properties would not make sense, no `componentN()` functions are generated.

#### Use data objects with sealed hierarchies

Data object declarations are particularly useful for sealed hierarchies like 
[sealed classes or sealed interfaces](sealed-classes.md).
They allow you to maintain symmetry with any data classes you may have defined alongside the object.

In this example, declaring `EndOfFile` as a `data object` instead of a plain `object` 
means that it will get the `toString()` function without the need to override it manually:

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```
{kotlin-runnable="true" id="data-objects-sealed-hierarchies"}

### Companion objects

Companion objects allow you to define class-level methods and properties. 
This makes it easy to create factory methods, hold constants, and access shared utilities.

An object declaration inside a class can be marked with the `companion` keyword:

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

Members of the companion object can be called simply by using the class name as the qualifier:


```kotlin
class User(val name: String) {
    // Defines a companion object that acts as a factory for creating User instances
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // Calls the companion object's factory method using the class name as the qualifier. 
    // Creates a new User instance
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // John Doe
}
```
{kotlin-runnable="true"}

The name of the companion object can be omitted, in which case the name `Companion` will be used:

```kotlin
class User(val name: String) {
    // Defines a companion object without a name
    companion object { }
}

// Accesses the companion object
val companionUser = User.Companion
```

Class members can access `private` members of their corresponding `companion object`:

```kotlin
class User(val name: String) {
    companion object {
        private val defaultGreeting = "Hello"
    }

    fun sayHi() {
        println(defaultGreeting)
    }
}
User("Nick").sayHi()
// Hello
```

When a class name is used by itself, it acts as a reference to the companion object of the class,
regardless of whether the companion object is named or not:

```kotlin
//sampleStart
class User1 {
    // Defines a named companion object
    companion object Named {
        fun show(): String = "User1's Named Companion Object"
    }
}

// References the companion object of User1 using the class name
val reference1 = User1

class User2 {
    // Defines an unnamed companion object
    companion object {
        fun show(): String = "User2's Companion Object"
    }
}

// References the companion object of User2 using the class name
val reference2 = User2
//sampleEnd

fun main() {
    // Calls the show method from the companion object of User1
    println(reference1.show()) 
    // User1's Named Companion Object

    // Calls the show method from the companion object of User2
    println(reference2.show()) 
    // User2's Companion Object
}
```
{kotlin-runnable="true"}

Although members of companion objects in Kotlin look like static members from other languages,
they are actually instance members of the companion object. This allows companion objects to implement interfaces:

```kotlin
interface Factory<T> {
    fun create(name: String): T
}

class User(val name: String) {
    // Defines a companion object that implements the Factory interface
    companion object : Factory<User> {
        override fun create(name: String): User = User(name)
    }
}

fun main() {
    // Uses the companion object as a Factory
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("Example User")
    println(newUser.name)
    // Example User
}
```
{kotlin-runnable="true"}

However, on the JVM you can have members of companion objects generated as real static methods and fields if you use
the `@JvmStatic` annotation. See the [Java interoperability](java-to-kotlin-interop.md#static-fields) section
for more detail.

### Semantic difference between object expressions and declarations

There are differences in initialization behavior between object expressions and object declarations:

* Object expressions are executed (and initialized) _immediately_, where they are used.
* Object declarations are initialized _lazily_, when accessed for the first time.
* A companion object is initialized when the corresponding class is loaded (resolved) that matches the semantics of a Java
  static initializer.
