[//]: # (title: Type checks and casts)

In Kotlin, you can do two things with types at runtime: check whether an object is a specific type, or convert it to another type.
Type **checks** help you confirm the kind of object you're dealing with, while type **casts** attempt to convert the object to another type.

> To learn specifically about **generics** type checks and casts, for example `List<T>`, `Map<K,V>`, see [Generics type checks and casts](generics.md#generics-type-checks-and-casts).
>
{style="tip"}

## `is` and `!is` operators

Use the `is` operator (or `!is` to negate it) to check if an object matches a type at runtime:

```kotlin
fun main() {
    val input: Any = "Hello, Kotlin"

    if (input is String) {
        println("Message length: ${input.length}")
        // Message length: 13
    }

    if (input !is String) { // Same as !(input is String)
        println("Input is not a valid message")
    } else {
        println("Processing message: ${input.length} characters")
        // Processing message: 13 characters
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-is-operator"}

You can also use `is` and `!is` operators to check if an object matches a subtype:

```kotlin
interface Animal {
    val name: String
    fun speak()
}

class Dog(override val name: String) : Animal {
    override fun speak() = println("$name says: Woof!")
}

class Cat(override val name: String) : Animal {
    override fun speak() = println("$name says: Meow!")
}

fun handleAnimal(animal: Animal) {
    println("Handling animal: ${animal.name}")
    animal.speak()
    
    // Use is operator to check for subtypes
    if (animal is Dog) {
        println("Special care instructions: This is a dog.")
    } else if (animal is Cat) {
        println("Special care instructions: This is a cat.")
    }
}

fun main() {
    val pets: List<Animal> = listOf(
        Dog("Buddy"),
        Cat("Whiskers"),
        Dog("Rex")
    )

    for (pet in pets) {
        handleAnimal(pet)
        println("---")
    }
    // Handling animal: Buddy
    // Buddy says: Woof!
    // Special care instructions: This is a dog.
    // ---
    // Handling animal: Whiskers
    // Whiskers says: Meow!
    // Special care instructions: This is a cat.
    // ---
    // Handling animal: Rex
    // Rex says: Woof!
    // Special care instructions: This is a dog.
    // ---
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-is-operator-subtype"}

This example uses the `is` operator to check if the `Animal` class instance has subtype `Dog` or `Cat` to print the relevant
care instructions.

You can check if an object is a supertype of its declared type, but it's not worthwhile because the answer is always true.
Every class instance is already an instance of its supertypes.

> To identify the type of an object at runtime, see [Reflection](reflection.md).
> 
{type="tip"}

## Smart casts

In most cases, you don't need to use explicit cast operators because the compiler automatically casts objects for you.
This is called smart-casting. The compiler tracks the type checks and [explicit casts](#unsafe-cast-operator) for immutable
values and inserts implicit (safe) casts automatically when necessary:

```kotlin
fun logMessage(data: Any) {
    // data is automatically cast to String
    if (data is String) {
        println("Received text: ${data.length} characters")
    }
}

fun main() {
    logMessage("Server started")
    // Received text: 14 characters
    logMessage(404)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast"}

The compiler is even smart enough to know that a cast is safe if a negative check leads to a return:

```kotlin
fun logMessage(data: Any) {
    // data is automatically cast to String
    if (data !is String) return

    println("Received text: ${data.length} characters")
}

fun main() {
    logMessage("User signed in")
    // Received text: 14 characters
    logMessage(true)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast-negative"}

### Control flow

Smart casts work not only for `if` conditional expressions but also for [`when` expressions](control-flow.md#when-expressions-and-statements):

```kotlin
fun processInput(data: Any) {
    when (data) {
        // data is automatically cast to Int
        is Int -> println("Log: Assigned new ID ${data + 1}")
        // data is automatically cast to String
        is String -> println("Log: Received message \"$data\"")
        // data is automatically cast to IntArray
        is IntArray -> println("Log: Processed scores, total = ${data.sum()}")
    }
}

fun main() {
    processInput(1001)
    // Log: Assigned new ID 1002
    processInput("System rebooted")
    // Log: Received message "System rebooted"
    processInput(intArrayOf(10, 20, 30))
    // Log: Processed scores, total = 60
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast-when"}

And for [`while` loops](control-flow.md#while-loops):

```kotlin
TODO()
```

If you declare a variable of `Boolean` type before using it in your `if`, `when`, or `while` condition, then any
information collected by the compiler about the variable will be accessible in the corresponding block for
smart-casting.

This can be useful when you want to do things like extract boolean conditions into variables. Then, you can give the
variable a meaningful name, which will improve your code readability and make it possible to reuse the variable later
in your code. For example:

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // The compiler can access information about
        // isCat, so it knows that animal was smart-cast
        // to the type Cat.
        // Therefore, the purr() function can be called.
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-local-variables" validate="false"}

### Logical operators

The compiler can perform smart casts on the right-hand side of `&&` or `||` operators if there is a type check (regular or negative) on the left-hand side:

```kotlin
// x is automatically cast to String on the right-hand side of `||`
if (x !is String || x.length == 0) return

// x is automatically cast to String on the right-hand side of `&&`
if (x is String && x.length > 0) {
    print(x.length) // x is automatically cast to String
}
```

If you combine type checks for objects with an `or` operator (`||`), a smart cast is made to their closest common supertype:

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus is smart-cast to a common supertype Status
        signalStatus.signal()
    }
}
```

> The common supertype is an **approximation** of a [union type](https://en.wikipedia.org/wiki/Union_type). Union types
> are [not currently supported in Kotlin](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types).
>
{style="note"}

### Inline functions

The compiler can smart-cast variables captured within lambda functions that are passed to [inline functions](inline-functions.md).

Inline functions are treated as having an implicit [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)
contract. This means that any lambda functions passed to an inline function are called in place. Since lambda functions
are called in place, the compiler knows that a lambda function can't leak references to any variables contained within
its function body.

The compiler uses this knowledge, along with other analyses to decide whether it's safe to smart-cast any of the
captured variables. For example:

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // The compiler knows that processor is a local variable and inlineAction()
        // is an inline function, so references to processor can't be leaked.
        // Therefore, it's safe to smart-cast processor.
      
        // If processor isn't null, processor is smart-cast
        if (processor != null) {
            // The compiler knows that processor isn't null, so no safe call 
            // is needed
            processor.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

### Exception handling

Smart cast information is passed on to `catch` and `finally` blocks. This makes your code safer
as the compiler tracks whether your object has a nullable type. For example:

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput is smart-cast to String type
    stringInput = ""
    try {
        // The compiler knows that stringInput isn't null
        println(stringInput.length)
        // 0

        // The compiler rejects previous smart cast information for 
        // stringInput. Now stringInput has the String? type.
        stringInput = null

        // Trigger an exception
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // The compiler knows stringInput can be null
        // so stringInput stays nullable.
        println(stringInput?.length)
        // null
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-exception-handling"}

### Smart cast prerequisites

> Note that smart casts work only when the compiler can guarantee that the variable won't change between the check and its usage.
>
{style="warning"}

Smart casts can be used in the following conditions:

<table style="none">
    <tr>
        <td>
            <code>val</code> local variables
        </td>
        <td>
            Always, except <a href="delegated-properties.md">local delegated properties</a>.
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> properties
        </td>
        <td>
            If the property is <code>private</code>, <code>internal</code>, or if the check is performed in the same <a href="visibility-modifiers.md#modules">module</a> where the property is declared. Smart casts can't be used on <code>open</code> properties or properties that have custom getters.
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> local variables
        </td>
        <td>
            If the variable is not modified between the check and its usage, is not captured in a lambda that modifies it, and is not a local delegated property.
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> properties
        </td>
        <td>
            Never, because the variable can be modified at any time by other code.
        </td>
    </tr>
</table>

## "Unsafe" cast operator

To explicitly cast an object to a non-nullable type, use the *unsafe* cast operator `as`:

```kotlin
val x: String = y as String
```

If the cast isn't possible, the compiler throws an exception. This is why it's called _unsafe_.

In the previous example, if `y` is `null`, the code above also throws an exception. This is because `null` can't be cast
to `String`, as `String` isn't [nullable](null-safety.md). To make the example work for possible null values, use a nullable
type on the right-hand side of the cast:

```kotlin
val x: String? = y as String?
```

## "Safe" (nullable) cast operator

To avoid exceptions, use the *safe* cast operator `as?`, which returns `null` on failure.

```kotlin
val x: String? = y as? String
```

Note that despite the fact that the right-hand side of `as?` is a non-nullable type `String`, the result of the cast is nullable.
