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

To work with data types other than strings, you can convert the input using conversion functions like `toInt()`, `toLong()`, `toDouble()`, `toFloat()`, and `toBoolean()` with dot syntax.
It is possible to read multiple inputs of different data types and store each input in a variable:

```kotlin
// Converts the input from a string to an integer value. For example: 12
val myNumber = readln().toInt()
print(myNumber)
// 12

// Converts the input from a string to a long value. For example: 10000000000
val myLong = readln().toLong()
print(myLong)
// 10000000000

// Converts the input from a string to a double value. For example: 345 
val myDouble = readln().toDouble()
print(myDouble)
// 345.0

// Converts the input from a string to a float value. For example: 879
val myFloat = readln().toFloat()
print(myFloat)
// 879.0

// Converts the input from a string to a boolean value. For example: true
val myBoolean = readln().toBoolean()
print(myBoolean)
// true
```

These conversion functions assume the user enters a valid representation of the target data type. For example, converting
"hello" to an integer using `toInt()` would result in an error as the function expects a digit in the string input.

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

The `readlnOrNull()` function is also helpful in safely handling the input. For example, when reading from files or streams where the length of the input is not known in advance.
The `readlnOrNull()` function reads from the standard input and returns null if the end of the input is reached, whereas `readln()` would throw an exception in such a case.

For an alternative way to read user input, see [Standard input with Java Scanner](java-read-scanner.md).