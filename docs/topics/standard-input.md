[//]: # (title: Standard input)

> Java Scanner is a slow tool. Use it only when you need the specific functionalities it offers.
> Otherwise, it's generally preferable to use Kotlin's `readln()` function to [read standard input](basic-syntax.md#read-from-the-standard-input).
>
{type="note"}

To read from the standard input, Java provides the `Scanner` class. 

Kotlin has two main ways to read from the standard input: 
the `Scanner` class, similar to Java, and the `readln()` function. 

Read the next sections for more details and examples of reading from the standard input in Java and Kotlin. 

## Read from the standard input with Java Scanner

In Java, the standard input is typically accessed through the `System.in` object. You need to import the `Scanner` class, 
create an object, and use methods like `nextLine()` and `nextInt()` to read different data types:

```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Reads a single line of input. For example: Hi there!
        System.out.print("Enter a line: ");
        String line = scanner.nextLine();
        System.out.println("You entered: " + line);
        // You entered: Hi there!

        // Reads an integer. For example: 08081990
        System.out.print("Enter an integer: ");
        int number = scanner.nextInt();
        System.out.println("You entered: " + number);
        // You entered: 08081990

        scanner.close();
    }
}
```

In Kotlin, you can use Java Scanner to read data from the standard input. Due to Kotlin's interoperability with Java libraries,
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

Here's a complete example of a code that reads two numbers and prints them in separate lines and reverse order:

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

    println(secondNumber)
    println(firstNumber)
    // 100
    // 99
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

## Read from the standard input with readln()

In Kotlin, the `readLine()` function is the most straightforward way to read input in Kotlin. This function reads a line 
of text from the standard input and returns it as a string:

```Kotlin
// Reads a string. For example: Charlotte
val name = readln()

// Reads a string and converts it into an integer. For example: 43
val age = readln().toInt() 

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

For more information, see [Read standard input](read-standard-input.md).