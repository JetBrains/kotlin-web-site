[//]: # (title: Read standard input)

Use the `readln()` function to read data from the standard input. It reads the whole line as a string:

```kotlin
// Reads and stores the user input in a variable. For example: Hi there!
val myInput = readln()

println(myInput)
// Hi there!

// Reads and prints the user input without storing it in a variable. For example: Hi, Kotlin!
println(readln())
// Hi, Kotlin!
```

To work with data types other than strings, you can convert the input using conversion functions like `toInt()`, `toLong()`, `toDouble()`, `toFloat()`, or `toBoolean()` with dot syntax.
It is possible to read multiple inputs of different data types and store each input in a variable:

```kotlin
// Converts the input from a string to an integer value. For example: 12
val myNumber = readln().toInt()
print(myNumber)
// 12

// Converts the input from a string to a double value. For example: 345 
val myDouble = readln().toDouble()
print(myDouble)
// 345.0

// Converts the input from a string to a boolean value. For example: true
val myBoolean = readln().toBoolean()
print(myBoolean)
// true
```

These conversion functions assume the user enters a valid representation of the target data type. For example, converting
"hello" to an integer using `toInt()` would result in an error as the function expects a digit in the string input.

To read several input elements separated by a delimiter, use the `split()` function specifying the delimiter. The following code sample
reads from the standard input, splits the input into a list of elements based on the delimiter, and converts each element of the list into a specific type:

```kotlin
// Reads the input, assuming the elements are separated by spaces, and converts them into integers. For example: 1 2 3 
val numbers = readln().split(' ').map { it.toInt() }
print(numbers)
//[1 2 3] 

// Reads the input, assuming the elements are separated by commas, and converts them into doubles. For example: 4,5,6
val doubles = readln().split(',').map { it.toDouble() }
print(doubles)
//[4.0,5.0,6.0]
```

You can use the `toIntOrNull()` function to safely convert user input from a string to an integer. This function returns an
integer if the conversion is successful. However, if the input is not a valid representation of an integer, it returns `null`:

```Kotlin
// Returns null if the input is invalid. For example: Hello!
val wrongInt = readln().toIntOrNull()
print(wrongInt)
// null

// Converts a valid input from a string to an integer. For example: 13
val correctInt = readln().toIntOrNull()
print(correctInt)
// 13
```

The `readlnOrNull()` function is also helpful in safely handling the input. The `readlnOrNull()` function reads from the 
standard input and returns null if the end of the input is reached, whereas `readln()` would throw an exception in such a case.

For an alternative way to read user input, see [Standard input with Java Scanner](standard-input.md).