[//]: # (title: Strings)
[//]: # (description: Learn how to work with strings in Kotlin, including string literals, string templates, multiline strings, and common text operations.)

The [`String`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/) type represents a sequence of
[characters](characters.md). You can use it for text values, such as words, sentences, messages, or structured text.

The `String` type is immutable. After you create a `String` object,
its contents stay the same for the rest of its lifetime. Any operation that appears
to modify the string actually creates a new string.

## Declare strings

To declare a `String` literal, enclose the value in double quotes (`""`). You can specify the `String` type
explicitly or let Kotlin infer it from the value:

```kotlin
val name: String = "Kotlin"
val message = "Hello, world!" // Kotlin infers String
```

Double-quoted string literals support [escape sequences](characters.md#escape-sequences) such as `\n` or `\t`:

```kotlin
val message = "Hello,\nworld!"
val quote = "Kotlin says, \"Hi\"."
```

### Multiline strings

To store text that consists of multiple lines or contains quotes that you don't want to escape,
use a multiline string enclosed in triple quotes (`""" """`):

```kotlin
val text = """
Hello,
Kotlin
"""

val quote = """Kotlin says, "Hi"."""
```

> Multiline strings don't support escape sequences.
> Kotlin treats such characters as a regular text.
>
{style="note"}

Multiline strings preserve line breaks and indentations as written in the source code.
This behavior is useful when you want the runtime value to match the text layout in your file.

In the following example, the spaces before each line are part
of the resulting string:

```kotlin
val text = """
    Hello,
    Kotlin
"""
```

To remove common leading indentation, use
the [`trimIndent()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/trim-indent.html) function. It detects the common
minimal indent of non-empty lines and removes it:

```kotlin
fun main() {
//sampleStart
    val text = """
        Hello,
        Kotlin
    """.trimIndent()
    
    println(text)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To control indentation removal more explicitly, use
the [`trimMargin()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/trim-margin.html) function. It
removes everything before and including the margin prefix on each line:

```kotlin
fun main() {
//sampleStart
    val text = """
        |Hello,
        |Kotlin
    """.trimMargin()
    
    println(text)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

By default, the `trimMargin()` function uses a pipe symbol (`|`) as the margin prefix, but you can pass another character
as a parameter. For example: `trimMargin(">")`.

> When you process a string with functions like `trimIndent()` or `trimMargin()`, the resulting string
> uses only newline (`\n`) separators, regardless of the platform.
>
{style="note"}


## String templates

String templates let you embed variables and expressions directly inside a `String` literal.
This process is called _interpolation_. You can use string templates in both
regular and multiline strings.

To insert a variable into a string, use the `$` symbol:

```kotlin
fun main() { 
//sampleStart
    val name = "Kotlin"
    println("Hello, $name") 
    // Hello, Kotlin
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To insert an expression into a string or to place a variable directly next to other text, use `${}`:

```kotlin
fun main() {
//sampleStart
    val text = "abc"
    println("The length of $text is ${text.length}")
    // The length of abc is 3
      
    val language = "Kotlin"
    println("${language}Lang")
    // KotlinLang
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> You can also combine strings with the `+` operator. However, string templates are usually easier
> to read and more idiomatic.
>
{style="tip"}

Template expressions can also contain double-quoted strings without escaping:

```kotlin
// Double-quoted string
val test = "${"test".uppercase()}"

// Multiline string
val result = """
Result: ${"OK".lowercase()}
"""
```

### Nullable values in string templates

If an interpolated expression or variable evaluates to `null`, the Kotlin compiler
inserts the text `null` into the resulting string. To replace `null` with another value,
use the [Elvis operator](null-safety.md#elvis-operator) (`?:`):

```kotlin 
fun main(){
//sampleStart
    val text: String? = null
  
    println("Hello, $text")
    // Hello, null

    println("Hello, ${text ?: "Kotlin"}")
    // Hello, Kotlin
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Multi-dollar string interpolation

In regular string templates, a single dollar sign (`$`) starts interpolation. If you need
to include literal dollar signs in a `String` value, use **multi-dollar string interpolation**.

Multi-dollar string interpolation allows you to specify how many consecutive dollar signs are required
to trigger interpolation. Dollar signs below that number are treated as literal characters.

For example, when you use `$$` before a `String` literal,
interpolation begins only with two consecutive dollar signs:

```kotlin
val KClass<*>.jsonSchema : String
    get() = $$"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta",
      "title": "$${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

> If you use single-dollar string interpolation, multi-dollar string interpolation doesn't affect your code.
> You can continue using a single `$` and apply multi-dollar signs
> when needed.
>
{style="tip"}

## Basic string operations

Kotlin provides a range of operations for working with strings. This section introduces some of
the most commonly used operations.

> Learn more about all available functions in the
> [API Reference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/).
>
{style="tip"}

### Get string length

To get the number of characters in a string, use the
[`length`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/length.html) property:

```kotlin 
fun main (){
//sampleStart
    val language = "Kotlin"
    println(language.length)
    // 6
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Access characters

You can access an individual character in a string
with the indexing operator (`[]`):

```kotlin 
fun main (){
//sampleStart
    val language = "Kotlin"
    
    println(language[0])
    // K
    println(language[5])
    // n
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> A string index starts at zero.
> If you try to access an index outside the valid range, Kotlin throws an exception.
>
{style="tip"}

You can also iterate over the characters in a string:

```kotlin
fun main(){
//sampleStart
    for (char in "Kotlin") {
      println(char)
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Extract parts of a string

To extract parts of a string, use one of the following functions:

* [`substring()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/substring.html) to return a new string with the selected part of
  the original text.
* [`subSequence()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/sub-sequence.html) to return a `CharSequence` with the selected
  part of the original text.

For example:

```kotlin
fun main() {
//sampleStart    
    val text = "Kotlin"
    println(text.substring(1))
    // otlin
    println(text.substring(1, 5))
    // otli
    println(text.subSequence(1, 5))
    // otli
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Since the `String` type is immutable, these functions don't modify the original string.

### Compare strings

You can check whether two strings have the same content with the `==` operator:

```kotlin
fun main(){
//sampleStart
    println("kotlin" == "kotlin")
    // true
  
    println("kotlin" == "Kotlin")
    // false
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also compare strings lexicographically (character by character) with the [`compareTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/compare-to.html)
function. It scans both strings until it finds the first differing pair of characters and returns:

* `0` when the strings are equal.
* A value less than `0` when the receiver is smaller than the argument.
* A value greater than `0` when the receiver is greater than the argument.

```kotlin
fun main() {
//sampleStart    
    println("abc".compareTo("abd") < 0)
    // true
    
    println("abc".compareTo("ABC") > 0)
    // true
    
    // Pass true to ignore case differences
    println("abc".compareTo("ABC", true) == 0)
    // true
//sampleEnd  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Work with string content

If you want to change the content of a string, create a modified copy of it
with functions like [`replace()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/replace.html), [`trim()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/trim.html),
[`uppercase()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/uppercase.html), and [`lowercase()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/lowercase.html):

```kotlin
fun main() {
//sampleStart
    val text = "  Hello, Kotlin  "

    println(text.trim())
    // Hello, Kotlin

    println(text.replace("Kotlin", "world"))
    //   Hello, world  

    println(text.uppercase())
    //   HELLO, KOTLIN  

    println(text.lowercase())
    //   hello, kotlin  
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also inspect the string content with the
[`contains()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/contains.html), [`startsWith()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/starts-with.html),
and [`endsWith()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/ends-with.html) functions:

```kotlin
fun main() { 
//sampleStart
    val domain = "kotlinlang.org"
    
    // Checks if the string contains "."
    println(domain.contains("."))
    // true
    
    // Checks if the string starts with "kotlin"
    println(domain.startsWith("kotlin"))
    // true
    
    // Checks if the string ends with ".org"
    println(domain.endsWith(".org"))
    // true
//sampleEnd
}
 ```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Split strings

You can divide a string into parts around a delimiter with
the [`split()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/split.html) function:

```kotlin
fun main() { 
//sampleStart
    val numbers = "one, two, three"
    println(numbers.split(", "))
    // [one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If you want to split a string into individual lines, use
the [`lines()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/lines.html) function:

```kotlin
fun main() { 
//sampleStart
    val numbers = "one\ntwo\nthree"
    println(numbers.lines())
    // [one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Build and format strings

> For most formatting tasks in Kotlin, use [string templates](#string-templates).
>
{style="tip"}

When you concatenate strings with the `+` operator,
Kotlin creates a new `String` object for each operation. However, this approach
may not be beneficial in loops or when you assemble many pieces. 
To avoid such issues, you can use the `buildString()` function or `StringBuilder`. They collect all pieces in a single mutable buffer
and produce only one string at the end.

Use the [`buildString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/build-string.html) function
when the logic that determines what to append is complex. For example, when you have multiple conditions
that contribute a different fragment. With `buildString()`, you don't handle the buffer directly.
The function creates a `StringBuilder` internally, runs your block, and returns the resulting string.

```kotlin
fun main() {
//sampleStart

    val hasErrors = true
    val hasWarnings = true
    val isComplete = false
    
    // buildString creates an empty buffer
    val status = buildString {
        // Appends "Errors found" to the buffer
        if (hasErrors) append("Errors found")
        if (hasWarnings) {
            // The buffer is not empty, appends "; "
            if (isNotEmpty()) append("; ")
            // Appends "Warnings found"
            append("Warnings found")
        }
        // isComplete = false, nothing to append
        if (isComplete) {
            if (isNotEmpty()) append("; ")
            append("Completed")
        }
        // The buffer is not empty, skips the fallback
        if (isEmpty()) append("OK")
    }
    
    println(status)
    // Errors found; Warnings found
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Use [`StringBuilder`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-string-builder/) when you need the buffer as an explicit value.
For example, to change the existing text:

```kotlin
fun main() {
//sampleStart
    val text = "Hello, Kotlin"
    val builder = StringBuilder(text)

    builder.replace(7, 13, "world")
    println(builder.toString()) 
    // Hello, world
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

On the JVM, you can also format a string with the [`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html) function:

```kotlin
val text = String.format("Hello, %s", "Kotlin") 
```  

> Use the `String.format()` function only when you specifically need formatter-style specifiers on the JVM.
> Learn more about format specifiers in the [Java Class Formatter documentation](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary).
>
{style="note"}

## String conversion

Often you may use strings to represent values of other types, such as numbers, Boolean values, or identifiers from the input.
Kotlin provides functions for converting values to strings and for parsing strings into other types.

To return a string representation of a value, use the [`toString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/to-string.html) function:

```kotlin
val number = 10
val text = number.toString()
```

In string templates and string concatenation, Kotlin converts values to strings automatically.

To convert a string to another type, use the corresponding parsing functions:

* For integer values: [`toByte()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-byte.html), [`toShort()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-short.html), [`toInt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-int.html), [`toLong()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-long.html)
* For floating-point values: [`toDouble()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-double.html), [`toFloat()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-float.html)
* For booleans: [`toBoolean()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-boolean.html)

These functions return a value of the requested type if the string has a valid format.
If the input may be invalid, use the `OrNull` variants. These functions return `null` 
instead of throwing an exception making them safe for user input or data that you don't
fully control:

```kotlin
val toInt = "10".toInt()
val toBoolean = "true".toBoolean()

// 1000000000000 exceeds maximum value of Int
val toIntInvalid= "1000000000000".toIntOrNull()
```