[//]: # (title: Standard input)

> Java Scanner is a slow tool. Use it only when you need the specific functionalities it offers.
> Otherwise, it's generally preferable to use Kotlin's `readln()` function to [read standard input](basic-syntax.md#read-from-the-standard-input).
>
{type="note"}

To read from the standard input, Java provides the `Scanner` class. Whereas Kotlin has two main ways to read from the standard input: 
the `Scanner` class, similar to Java, and the `readln()` function.

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

Due to Kotlin's interoperability with Java libraries,
it's possible to access Java Scanner from Kotlin code out of the box.

To use Java's Scanner in Kotlin, you need to import the Scanner and initialize it by passing a `System.in` object that represents the standard input stream and dictates how to read the data.
You can apply the [available reading methods](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html) for reading values different from strings,
such as `.nextLine()`, `.next()`, and `.nextInt()`:

```Kotlin
// Imports Java's Scanner
import java.util.Scanner

fun main() {
    // Initializes the Scanner
    val scanner = Scanner(System.`in`)

    // Reads a whole string line. For example: "Hello, Kotlin"
    val line = scanner.nextLine()
    print(line)
    // Hello, Kotlin

    // Reads a string. For example: "Hello"
    val string = scanner.next()
    print(string)
    // Hello

    // Reads a number. For example: 123
    val num = scanner.nextInt()
    print(num)
    // 123
}
```

Other useful methods for reading input with Java Scanner are `hasNext()`, `useDelimiter()`, and `close()`. 

The `hasNext()`
method checks if there's more data available in the input. It returns the boolean value `true` if there are remaining elements to iterate and `false` if no more elements are left in the input.

The `useDelimiter()` method sets the delimiter for reading input elements. The delimiter is whitespaces by default, but you can specify other characters. 
For example, `useDelimiter(",")` reads the input elements separated by commas. 

The `close()` method closes the input stream associated with the Scanner, preventing further use of the Scanner for reading input.

>It's important to use the `close()` method whenever you're finished using Java Scanner. Closing the Java Scanner
> releases the resources it consumes and ensures proper program behavior.
>
{type="note"}

## Read from the standard input with readln()

In Kotlin, the `readln()` function is the most straightforward way to read input in Kotlin. This function reads a line 
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