[//]: # (title: Functions)

Kotlin functions are declared using the `fun` keyword:

```kotlin
fun main() {
    //sampleStart
    // Defines a function that multiplies its parameter by 2
    fun double(number: Int): Int {
        return 2 * number
    }

    // Calls the function and stores the result
    val result = double(2)
    println(result)
    // Prints: 4
    //sampleEnd
}
```
{kotlin-runnable="true"}

## Function usage

Functions are called using the standard approach:

```kotlin
fun main() {
    //sampleStart
    // Defines a simple function
    fun double(number: Int): Int {
        return 2 * number
    }

    // Demonstrates function call syntax
    val result = double(2)
    println(result)
    // Prints: 4
    //sampleEnd
}
```
{kotlin-runnable="true"}

Calling member functions uses dot notation:

```kotlin
// Creates an instance of class Stream and calls its read() method
Stream().read()
```

### Parameters

Function parameters are defined using Pascal notation - *name*: *type*. Parameters are separated using commas, and each
parameter must be explicitly typed:

```kotlin
fun main() {
    //sampleStart
    // Calculates the power of a number using exponentiation
    fun powerOf(number: Int, exponent: Int): Int {
        return Math.pow(number.toDouble(), exponent.toDouble()).toInt()
    }

    val result = powerOf(2, 3)
    println(result)
    // Prints: 8
    //sampleEnd
}
```
{kotlin-runnable="true"}

You can use a [trailing comma](coding-conventions.md#trailing-commas) when you declare function parameters:

```kotlin
// Declares a function with parameters using trailing comma
fun powerOf(
    number: Int,
    exponent: Int, // trailing comma
) {
    println("Calculating $number to the power of $exponent")
}
```

### Default arguments

Function parameters can have default values, which are used when you skip the corresponding argument. This reduces the number
of overloads:

```kotlin
fun main() {
    //sampleStart
    // Processes text with customizable options
    fun processText(
        text: String,
        upperCase: Boolean = true,
        addPrefix: String = "",
    ) {
        var result = text
        if (upperCase) {
            result = result.uppercase()
        }
        println(addPrefix + result)
    }

    // Using different combinations of default arguments
    processText("hello")
    // Prints: HELLO
    processText("hello", upperCase = false)
    // Prints: hello
    processText("hello", addPrefix = "Message: ")
    // Prints: Message: HELLO
    //sampleEnd
}
```
{kotlin-runnable="true"}

A default value is set by appending `=` to the type.

Overriding methods always use the base method's default parameter values.
When overriding a method that has default parameter values, the default parameter values must be omitted from the signature:

```kotlin
fun main() {
    //sampleStart
    // Defines a base class with a method having default parameter
    open class MessageProcessor {
        open fun process(message: String = "Default message") {
            println("Processing: $message")
        }
    }

    // Creates a derived class that overrides the process method
    class CustomProcessor : MessageProcessor() {
        override fun process(message: String) {  // No default value is allowed
            println("Custom processing: $message")
        }
    }

    // Demonstrates the usage of both classes
    val processor = MessageProcessor()
    processor.process()  // Uses default value
    // Prints: Processing: Default message

    val customProcessor = CustomProcessor()
    customProcessor.process("Hello")
    // Prints: Custom processing: Hello
    //sampleEnd
}
```
{kotlin-runnable="true"}

If a default parameter precedes a parameter with no default value, the default value can only be used by calling
the function with [named arguments](#named-arguments):

```kotlin
fun main() {
    //sampleStart
    // Configures email settings with default server but required port
    fun configureEmail(
        server: String = "smtp.default.com",
        port: Int,
    ) {
        println("Configuring email: server=$server, port=$port")
    }

    // Calls the function using named argument to specify only the required parameter
    configureEmail(port = 587)
    // Prints: Configuring email: server=smtp.default.com, port=587

    // Specifies both parameters using named arguments
    configureEmail(server = "smtp.custom.com", port = 465)
    // Prints: Configuring email: server=smtp.custom.com, port=465
    //sampleEnd
}
```
{kotlin-runnable="true"}

If the last argument after default parameters is a [lambda](lambdas.md#lambda-expression-syntax),
you can pass it either as a named argument or [outside the parentheses](lambdas.md#passing-trailing-lambdas):

```kotlin
fun main() {
    //sampleStart
    // Processes data with configurable options and a transformation function
    fun processData(
        data: String,
        uppercase: Boolean = false,
        transform: () -> String
    ) {
        var result = if (uppercase) data.uppercase() else data
        result = transform()
        println("Result: $result")
    }

    // Passes lambda as the last parameter outside parentheses
    processData("hello") { 
        "Transformed text"
    }
    // Prints: Result: Transformed text

    // Uses named arguments with lambda
    processData(
        data = "hello",
        uppercase = true,
        transform = { "TRANSFORMED TEXT" }
    )
    // Prints: Result: TRANSFORMED TEXT

    // Uses lambda outside parentheses with default values
    processData("hello") {
        "Another transformation"
    }
    // Prints: Result: Another transformation
    //sampleEnd
}
```
{kotlin-runnable="true"}

### Named arguments

You can name one or more of a function's arguments when calling it. This can be helpful when a function has many
arguments and it's difficult to associate a value with an argument, especially if it's a boolean or `null` value.

When you use named arguments in a function call, you can freely change the order that they are listed in. If you want to
use their default values, you can just leave these arguments out altogether.

Consider this example of a text formatting function:

```kotlin
fun main() {
    //sampleStart
    // Formats text with various customization options
    fun formatText(
        text: String,
        capitalizeWords: Boolean = false,
        addSpaces: Boolean = true,
        removeSpecialChars: Boolean = false,
        prefix: String = "",
    ) {
        var result = text

        if (removeSpecialChars) {
            result = result.replace(Regex("[^A-Za-z0-9 ]"), "")
        }

        if (capitalizeWords) {
            result = result.split(" ").map { it.capitalize() }.joinToString(" ")
        }

        if (!addSpaces) {
            result = result.replace(" ", "")
        }

        println(prefix + result)
    }

    // Calls function without named arguments - harder to understand the purpose of each boolean
    formatText("hello world!", true, false, true)
    // Prints: Hello World

    // Calls function with named arguments - much clearer what each parameter does
    formatText(
        text = "hello world!",
        capitalizeWords = true,
        addSpaces = false,
        removeSpecialChars = true
    )
    // Prints: HelloWorld

    // Uses named arguments to skip some parameters with default values
    formatText(
        text = "hello world!",
        capitalizeWords = true,
        prefix = "Result: "
    )
    // Prints: Result: Hello World
    //sampleEnd
}
```
{kotlin-runnable="true"}

After the first skipped argument, you must name all subsequent arguments. This helps maintain code clarity:

```kotlin
fun main() {
    //sampleStart
    // Formats user data with various options
    fun formatUserData(
        name: String,
        age: Int,
        isAdmin: Boolean = false,
        showEmail: Boolean = true,
        email: String = ""
    ) {
        println("User: $name, Age: $age" +
                (if (isAdmin) " (Admin)" else "") +
                (if (showEmail && email.isNotEmpty()) ", Email: $email" else ""))
    }

    // Uses mix of positional and named arguments
    formatUserData("Alice", 25, showEmail = true, email = "alice@example.com")
    // Prints: User: Alice, Age: 25, Email: alice@example.com

    // Uses all named arguments in different order
    formatUserData(
        age = 30,
        name = "Bob",
        isAdmin = true,
        email = "bob@example.com"
    )
    // Prints: User: Bob, Age: 30 (Admin), Email: bob@example.com
    //sampleEnd
}
```
{kotlin-runnable="true"}

You can pass a [variable number of arguments (`vararg`)](#variable-number-of-arguments-varargs) with names using the
`spread` operator:

```kotlin
fun main() {
    //sampleStart
    // Processes multiple log messages with a specified log level
    fun logMessages(level: String = "INFO", vararg messages: String) {
        messages.forEach { message ->
            println("[$level] $message")
        }
    }

    // Creates an array of messages
    val debugMessages = arrayOf("Starting process", "Process completed")

    // Uses named arguments with spread operator
    logMessages(
        level = "DEBUG",
        messages = *debugMessages
    )
    // Prints:
    // [DEBUG] Starting process
    // [DEBUG] Process completed

    // Passes individual messages directly
    logMessages("WARNING", "Invalid input", "Process failed")
    // Prints:
    // [WARNING] Invalid input
    // [WARNING] Process failed
    //sampleEnd
}
```
{kotlin-runnable="true"}

> When calling Java functions on the JVM, you can't use the named argument syntax because Java bytecode does not
> always preserve the names of function parameters.
>
{style="note"}

### Unit-returning functions

If a function does not return a useful value, its return type is `Unit`. `Unit` is a type with only one value - `Unit`.
This value does not have to be returned explicitly:

```kotlin
fun main() {
    //sampleStart
    // Demonstrates a Unit-returning function with explicit return type
    fun greetUser(name: String?): Unit {
        if (name != null) {
            println("Hello, $name!")
        } else {
            println("Hello, guest!")
        }
        // No explicit return needed
    }

    // Calls the function with different arguments
    greetUser("Alice")
    // Prints: Hello, Alice!
    greetUser(null)
    // Prints: Hello, guest!
    //sampleEnd
}
```
{kotlin-runnable="true"}

The `Unit` return type declaration is also optional. The above code is equivalent to:

```kotlin
fun main() {
    //sampleStart
    // Demonstrates a Unit-returning function without explicit return type
    fun greetUser(name: String?) {
        if (name != null) {
            println("Hello, $name!")
        } else {
            println("Hello, guest!")
        }
    }

    // Function behaves the same way
    greetUser("Bob")
    // Prints: Hello, Bob!
    //sampleEnd
}
```
{kotlin-runnable="true"}

### Single-expression functions

When the function body consists of a single expression, the curly braces can be omitted and the body specified after an `=` symbol:

```kotlin
fun main() {
    //sampleStart
    // Demonstrates a single-expression function with explicit return type
    fun calculateArea(width: Int, height: Int): Int = width * height

    // Uses the function to calculate rectangle areas
    val smallRectangle = calculateArea(2, 3)
    println("Small rectangle area: $smallRectangle")
    // Prints: Small rectangle area: 6

    val largeRectangle = calculateArea(10, 20)
    println("Large rectangle area: $largeRectangle")
    // Prints: Large rectangle area: 200
    //sampleEnd
}
```
{kotlin-runnable="true"}

Explicitly declaring the return type is [optional](#explicit-return-types) when this can be inferred by the compiler:

```kotlin
fun main() {
    //sampleStart
    // Demonstrates a single-expression function with type inference
    fun calculateCircleArea(radius: Double) = Math.PI * radius * radius

    // Uses the function with different radius values
    val smallCircle = calculateCircleArea(2.0)
    println("Small circle area: %.2f".format(smallCircle))
    // Prints: Small circle area: 12.57

    val largeCircle = calculateCircleArea(5.0)
    println("Large circle area: %.2f".format(largeCircle))
    // Prints: Large circle area: 78.54
    //sampleEnd
}
```
{kotlin-runnable="true"}

### Explicit return types

Functions with block body must always specify return types explicitly, unless it's intended for them to return `Unit`,
[in which case specifying the return type is optional](#unit-returning-functions).

```kotlin
fun main() {
    //sampleStart
    // Demonstrates a function requiring explicit return type due to complex logic
    fun calculateGrade(score: Int): String {
        if (score < 0 || score > 100) {
            return "Invalid Score"
        }

        return when {
            score >= 90 -> "A"
            score >= 80 -> "B"
            score >= 70 -> "C"
            score >= 60 -> "D"
            else -> "F"
        }
    }

    // Tests the function with different scores
    println("Score 95: ${calculateGrade(95)}")
    // Prints: Score 95: A
    println("Score 85: ${calculateGrade(85)}")
    // Prints: Score 85: B
    println("Score -5: ${calculateGrade(-5)}")
    // Prints: Score -5: Invalid Score
    //sampleEnd
}
```
{kotlin-runnable="true"}

Kotlin does not infer return types for functions with block bodies because such functions may have complex control flow
in the body, and the return type will be non-obvious to the reader (and sometimes even for the compiler).

### Variable number of arguments (varargs)

You can mark a parameter of a function (usually the last one) with the `vararg` modifier:

```kotlin
fun main() {
    //sampleStart
    // Creates a list from a variable number of elements
    fun <T> createList(vararg elements: T): List<T> {
        // Converts vararg parameter to list
        return elements.toList()
    }

    // Demonstrates different ways to use vararg parameter
    val numbers = createList(1, 2, 3, 4, 5)
    println("Numbers: $numbers")
    // Prints: Numbers: [1, 2, 3, 4, 5]

    val fruits = createList("apple", "banana", "orange")
    println("Fruits: $fruits")
    // Prints: Fruits: [apple, banana, orange]
    //sampleEnd
}
```
{kotlin-runnable="true"}

Inside a function, a `vararg`-parameter of type `T` is visible as an array of `T`. Only one parameter can be marked as `vararg`.
If a `vararg` parameter is not the last one in the list, values for the subsequent parameters must be passed using named arguments.

Here's an example demonstrating more complex usage of varargs:

```kotlin
fun main() {
    //sampleStart
    // Processes multiple items with a prefix
    fun processItems(prefix: String, vararg items: String) {
        items.forEach { item ->
            println("$prefix: $item")
        }
    }

    // Uses vararg with individual arguments
    processItems("Item", "A", "B", "C")
    // Prints:
    // Item: A
    // Item: B
    // Item: C

    // Uses spread operator with an array
    val moreItems = arrayOf("X", "Y", "Z")
    processItems("Element", *moreItems)
    // Prints:
    // Element: X
    // Element: Y
    // Element: Z
    //sampleEnd
}
```
{kotlin-runnable="true"}

When working with primitive type arrays, you need to convert them to regular arrays:

```kotlin
fun main() {
    //sampleStart
    // Demonstrates working with primitive arrays and varargs
    fun sumNumbers(vararg numbers: Int): Int {
        return numbers.sum()
    }

    // Creates a primitive type array
    val primitiveArray = intArrayOf(1, 2, 3)

    // Converts primitive array to regular array and uses spread operator
    val sum = sumNumbers(*primitiveArray)
    println("Sum: $sum")
    // Prints: Sum: 6
    //sampleEnd
}
```
{kotlin-runnable="true"}

### Infix notation

Functions marked with the `infix` keyword can also be called using the infix notation (omitting the dot and the parentheses
for the call). Infix functions must meet the following requirements:

* They must be member functions or [extension functions](extensions.md)
* They must have a single parameter
* The parameter must not [accept variable number of arguments](#variable-number-of-arguments-varargs) and must have
no [default value](#default-arguments)

```kotlin
fun main() {
    //sampleStart
    // Defines a class with an infix function
    class PairNumber(val value: Int) {
        // Creates an infix function to pair numbers
        infix fun pair(other: Int): Pair<Int, Int> {
            return Pair(this.value, other)
        }
    }

    // Uses the infix function notation
    val number = PairNumber(1)
    val pair1 = number pair 2  // Infix notation
    val pair2 = number.pair(3) // Standard notation

    println("Infix notation result: $pair1")
    // Prints: Infix notation result: (1, 2)
    println("Standard notation result: $pair2")
    // Prints: Standard notation result: (1, 3)
    //sampleEnd
}
```
{kotlin-runnable="true"}

Here's another example with a custom string operation:

```kotlin
fun main() {
    //sampleStart
    // Defines an infix extension function for String
    infix fun String.addSeparator(other: String): String {
        return "$this -> $other"
    }

    // Uses the infix function in different ways
    val result1 = "Hello" addSeparator "World"  // Infix notation
    val result2 = "Kotlin".addSeparator("Fun")  // Standard notation

    println(result1)
    // Prints: Hello -> World
    println(result2)
    // Prints: Kotlin -> Fun
    //sampleEnd
}
```
{kotlin-runnable="true"}

> Infix function calls have lower precedence than arithmetic operators, type casts, and the `rangeTo` operator.
> The following expressions are equivalent:
> * `1 shl 2 + 3` is equivalent to `1 shl (2 + 3)`
> * `0 until n * 2` is equivalent to `0 until (n * 2)`
> * `xs union ys as Set<*>` is equivalent to `xs union (ys as Set<*>)`
>
> On the other hand, an infix function call's precedence is higher than that of the boolean operators `&&` and `||`, `is`-
> and `in`-checks, and some other operators. These expressions are equivalent as well:
> * `a && b xor c` is equivalent to `a && (b xor c)`
> * `a xor b in c` is equivalent to `(a xor b) in c`
>
{style="note"}

Note that infix functions always require both the receiver and the parameter to be specified. When you're
calling a method on the current receiver using the infix notation, use `this` explicitly:

```kotlin
fun main() {
    //sampleStart
    // Defines a collection class with an infix function
    class StringCollection {
        private val items = mutableListOf<String>()

        // Defines an infix function to add items
        infix fun add(item: String) {
            items.add(item)
        }

        // Demonstrates different ways to call the add function
        fun addItems() {
            this add "First"   // Correct: uses infix notation with explicit receiver
            add("Second")      // Correct: uses standard notation
            // add "Third"     // Incorrect: receiver must be specified for infix notation

            println("Items in collection: $items")
        }
    }

    // Creates an instance and adds items
    val collection = StringCollection()
    collection.addItems()
    // Prints: Items in collection: [First, Second]
    //sampleEnd
}
```
{kotlin-runnable="true"}

## Function scope

Kotlin functions can be declared at the top level in a file, meaning you do not need to create a class to hold a function,
which you are required to do in languages such as Java, C#, and Scala ([top level definition is available since Scala 3](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)). In addition
to top level functions, Kotlin functions can also be declared locally as member functions and extension functions.

Here's an example demonstrating different function scopes:

```kotlin
fun main() {
    //sampleStart
    // Top-level function (imagine this at file level)
    fun calculateSquare(number: Int): Int {
        return number * number
    }

    // Class with member function
    class Calculator {
        private var result: Int = 0

        // Member function
        fun add(number: Int) {
            result += number
            println("Current result: $result")
        }

        // Function with local function
        fun calculateSumOfSquares(vararg numbers: Int) {
            // Local function that can access outer scope
            fun square(n: Int) = n * n

            var sum = 0
            for (number in numbers) {
                sum += square(number)  // Uses local function
            }
            println("Sum of squares: $sum")
        }
    }

    // Demonstrates usage of functions in different scopes
    val square = calculateSquare(5)
    println("Square of 5: $square")
    // Prints: Square of 5: 25

    val calculator = Calculator()
    calculator.add(3)
    // Prints: Current result: 3
    calculator.add(7)
    // Prints: Current result: 10

    calculator.calculateSumOfSquares(2, 3, 4)
    // Prints: Sum of squares: 29
    //sampleEnd
}
```
{kotlin-runnable="true"}

### Local functions

Kotlin supports local functions, which are functions inside other functions. Local functions can access variables from the outer scope:

```kotlin
fun main() {
    //sampleStart
    // Demonstrates local functions with access to outer scope
    fun processNumbers(numbers: List<Int>) {
        var count = 0

        // Local function that can access count from outer scope
        fun incrementCountFor(predicate: (Int) -> Boolean) {
            for (number in numbers) {
                if (predicate(number)) {
                    count++
                }
            }
            println("Found $count numbers")
        }

        // Uses local function to count even numbers
        incrementCountFor { it % 2 == 0 }
        // Prints: Found {number of even integers} numbers

        count = 0  // Resets counter

        // Uses local function to count numbers greater than 5
        incrementCountFor { it > 5 }
        // Prints: Found {number of integers > 5} numbers
    }

    // Tests the function with a list of numbers
    processNumbers(listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
    //sampleEnd
}
```
{kotlin-runnable="true"}

### Member functions

A member function is a function that is defined inside a class or object:

```kotlin
fun main() {
    //sampleStart
    // Defines a class representing a bank account
    class BankAccount(private var balance: Double) {
        // Member function to deposit money
        fun deposit(amount: Double) {
            if (amount > 0) {
                balance += amount
                println("Deposited $amount. New balance: $balance")
            } else {
                println("Invalid deposit amount")
            }
        }

        // Member function to withdraw money
        fun withdraw(amount: Double) {
            if (amount > 0 && amount <= balance) {
                balance -= amount
                println("Withdrawn $amount. New balance: $balance")
            } else {
                println("Invalid withdrawal amount or insufficient funds")
            }
        }

        // Member function to check balance
        fun checkBalance() {
            println("Current balance: $balance")
        }
    }

    // Creates an account and performs operations
    val account = BankAccount(100.0)
    account.checkBalance()
    // Prints: Current balance: 100.0

    account.deposit(50.0)
    // Prints: Deposited 50.0. New balance: 150.0

    account.withdraw(70.0)
    // Prints: Withdrawn 70.0. New balance: 80.0

    account.withdraw(90.0)
    // Prints: Invalid withdrawal amount or insufficient funds
    //sampleEnd
}
```
{kotlin-runnable="true"}

For more information on classes and overriding members see [Classes](classes.md) and [Inheritance](classes.md#inheritance).

## Generic functions

Functions can have generic parameters, which are specified using angle brackets before the function name:

```kotlin
fun main() {
    //sampleStart
    // Demonstrates a generic function that creates a list wrapper
    class ListWrapper<T>(private val item: T) {
        fun getList(): List<T> = listOf(item)
    }

    // Generic function to create a ListWrapper
    fun <T> wrapInList(item: T): ListWrapper<T> {
        return ListWrapper(item)
    }

    // Uses the generic function with different types
    val numberWrapper = wrapInList(42)
    println("Number list: ${numberWrapper.getList()}")
    // Prints: Number list: [42]

    val stringWrapper = wrapInList("Hello")
    println("String list: ${stringWrapper.getList()}")
    // Prints: String list: [Hello]
    //sampleEnd
}
```
{kotlin-runnable="true"}

For more information on generic functions, see [Generics](generics.md).

## Tail recursive functions

Kotlin supports a style of functional programming known as [tail recursion](https://en.wikipedia.org/wiki/Tail_call).
For some algorithms that would normally use loops, you can use a recursive function instead without the risk of stack overflow.
When a function is marked with the `tailrec` modifier and meets the required formal conditions, the compiler optimizes out
the recursion, leaving behind a fast and efficient loop based version instead:

```kotlin
fun main() {
    //sampleStart
    // Calculates factorial using tail recursion
    tailrec fun factorial(n: Long, accumulator: Long = 1): Long =
        when {
            n <= 1 -> accumulator
            else -> factorial(n - 1, n * accumulator)
        }

    // Tests factorial function with different numbers
    println("Factorial of 5: ${factorial(5)}")
    // Prints: Factorial of 5: 120

    println("Factorial of 10: ${factorial(10)}")
    // Prints: Factorial of 10: 3628800

    // Demonstrates a more complex tail recursive function
    // Finds the greatest common divisor using Euclidean algorithm
    tailrec fun gcd(a: Int, b: Int): Int =
        if (b == 0) a
        else gcd(b, a % b)

    // Tests GCD function with different number pairs
    println("GCD of 48 and 36: ${gcd(48, 36)}")
    // Prints: GCD of 48 and 36: 12

    println("GCD of 125 and 25: ${gcd(125, 25)}")
    // Prints: GCD of 125 and 25: 25
    //sampleEnd
}
```
{kotlin-runnable="true"}

The equivalent non-tail-recursive implementation would look like this:

```kotlin
fun main() {
    //sampleStart
    // Non-tail-recursive factorial (less efficient, risk of stack overflow)
    fun factorial(n: Long): Long =
        if (n <= 1) 1
        else n * factorial(n - 1)  // Not tail recursive: multiplication after recursive call

    // Traditional loop-based implementation
    fun factorialLoop(n: Long): Long {
        var result = 1L
        for (i in 1..n) {
            result *= i
        }
        return result
    }

    // Compares results of different implementations
    val n = 5L
    println("Tail recursive factorial: ${factorial(n, 1)}")
    println("Non-tail recursive factorial: ${factorial(n)}")
    println("Loop-based factorial: ${factorialLoop(n)}")
    // All print: 120
    //sampleEnd
}
```
{kotlin-runnable="true"}

To be eligible for the `tailrec` modifier, a function must call itself as the last operation it performs. You cannot use
tail recursion when there is more code after the recursive call, within `try`/`catch`/`finally` blocks, or on open functions.
Currently, tail recursion is supported by Kotlin for the JVM and Kotlin/Native.

**See also**:
* [Inline functions](inline-functions.md)
* [Extension functions](extensions.md)
* [Higher-order functions and lambdas](lambdas.md)
