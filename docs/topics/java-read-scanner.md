[//]: # (title: Standard input)

> Java Scanner is a slow tool. Use it only when you need the specific functionalities it offers.
> Otherwise, it's generally preferable to use Kotlin's `readln()` function to [read standard input](basic-syntax.md#read-from-the-standard-input).
>
{type="note"}

In Kotlin, you can use Java Scanner to read data from standard input. Due to Kotlin's interoperability with Java libraries,
it's possible to access Java Scanner from Kotlin code out of the box.

To use Java's Scanner, you need to first import it by adding the following statement at the top of your source code file:

```Kotlin
import java.util.Scanner
```

Initialize the scanner by passing a `System.in` object that represents the standard input stream and dictates how to read the data.
In this example, we assign the object to a variable called `scanner`:

```Kotlin
val scanner = Scanner(System.`in`)
```

The `scanner` variable facilitates applying the [available reading methods](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html). Java Scanner provides several methods for reading values of different types,
such as `.nextLine()`, `.next()`, and `.nextInt()`:

```Kotlin
// Reads a whole string line. For example: "Hello, Kotlin"
val line = scanner.nextLine()
// Reads a string. For example: "Hello"
val string = scanner.next()
// Reads a number. For example: 123
val num = scanner.nextInt()
```

Here's a complete example of a code that reads two numbers and prints them in a single line but in reverse order:

```Kotlin
// Imports Java's Scanner
import java.util.Scanner

fun main() {
    // Initializes the scanner
    val scanner = Scanner(System.`in`)

    // Reads the first number. For example: 99
    val firstNumber = scanner.nextInt()
    // Reads the second number. For example: 100
    val secondNumber = scanner.nextInt()

    print(secondNumber)
    print(firstNumber)
    // 10099
}
```

Other useful methods for reading input with Java Scanner are `hasNext()`, `useDelimiter()`, and `close()`. 

The `hasNext()`
method checks if there's more data available in the input. It returns the boolean value `true` if there are remaining elements to iterate and `false` if no more elements are left in the input.

The `useDelimiter()` method sets the delimiter for reading input elements. The delimiter is whitespaces by default, but you can specify other characters. 
For example, `useDelimiter(",")` reads the input elements separated by commas. 

The `close()` method closes the input stream associated with the scanner, preventing further use of the scanner for reading input.

>It's important to use the `close()` method whenever you're finished using Java Scanner. Closing the Java Scanner
> releases the resources it consumes and ensures proper program behavior.
>
{type="note"}