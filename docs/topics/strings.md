[//]: # (title: Strings)
[//]: # (description: Learn how to work with strings in Kotlin, including string literals, string templates, multiline strings, and common text operations.)

<show-structure depth="1"/>

The [`String`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/) type represents a sequence of
[characters](characters.md). 

Use `String` for text values, such as words, sentences, messages, or structured text. 

The `String` type is immutable. This means that once you create a `String`, you cannot change its contents.

## Declare strings

To declare a `String` literal, enclose the value in double quotes (`""`). 

You can specify the `String` type explicitly or let Kotlin infer it from the value:

```kotlin
val name: String = "Kotlin"
val message = "Hello, world!" // Kotlin infers String
```

### Nullable values

To declare a nullable value, use `String?`:
```kotlin
val maybeAbsent: String? = null
```

### Escape sequences

Double-quoted string literals support [escape sequences](characters.md#escape-sequences) such as `\n` or `\t`: 

```kotlin
val message = "Hello,\nworld!"
val quote = "Kotlin says, \"Hi\"."
```

Use escape sequences for special characters that are difficult to write directly in source code or have a
special meaning.

## Multiline strings

To store text that consists of multiple lines or contains quotes that you do not want to escape,
use a multiline `String` enclosed in triple quotes (`""" """`):

```kotlin
val text = """
Hello,
Kotlin
"""

val quote = """Kotlin says, "Hi"."""
```

> Multiline strings do not support escape sequences. 
> Characters such as `\n` and `\t` are treated as regular text. 
>
{style="note"}

### Line breaks and indentation

Multiline strings preserve **line breaks** and **indentations** as written in the source code. 

You can use this when you want the runtime value to match the text layout in your file.

In the following example, the spaces before each line are part
of the resulting `String`:

```kotlin
val text = """
    Hello,
    Kotlin
"""
```

To remove common leading indentation, use 
[`trimIndent()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/trim-indent.html). It detects the common
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

To control indentation more explicitly, use 
[`trimMargin()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/trim-margin.html). This function 
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

By default, `trimMargin()` uses a pipe symbol (`|`) as the margin prefix, but you can pass another character 
as a parameter. For example: `trimMargin(">")`.

> When you process a `String` with functions like `trimIndent()` or `trimMargin()`, the resulting `String`
> uses only newline (`\n`) separators, regardless of the platform.
> 
{style="note"}


## String templates

String templates let you insert variables and expressions directly into a `String`. This process is called 
_interpolation_. 

You can use string templates in both regular and multiline strings.

* To insert a variable, use the `$` symbol:

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

* To insert an expression, or to place a variable directly next to other text, use `${}`:

  ```kotlin
  fun main() {
  //sampleStart
      val text = "abc"
      println("The length of $text is ${text.length}")
      // // The length of abc is 3
      val language = "Kotlin"
      println("${language}Lang")
      // KotlinLang
  // sampleEnd
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

If a template expression has a nullable type and a `null` value, the Kotlin compiler 
inserts the text `null` into the resulting `String`:

```kotlin 
fun main(){
    //sampleStart
    val text: String? = null
    println("Hello, $text")
    // Hello, null
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
 
To replace `null` with another value, use the [Elvis operator](null-safety.md#elvis-operator) (`?:`): 

```kotlin 
fun main (){
    //sampleStart
    val text: String? = null
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


> If you use single-dollar string interpolation, multi-dollar string interpolation does not affect your code.
> 
> You can continue using a single `$` and apply multi-dollar signs 
> when needed.
>
{style="tip"}


## Access characters in a string

You can access an individual character in a `String` by its index. To do so, 
use the indexing operator (`[]`): 

```kotlin 
fun main (){
    //sampleStart
    val language = "Kotlin"
    
    println(language[0]) // K
    println(language[5]) // n
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> A `String` index starts at zero. 
> 
{style="note"}

If you try to access an index outside the valid range, Kotlin throws an exception: 

```kotlin 
fun main (){
    //sampleStart
    val language = "Kotlin"
    println(language[20]) // Exception
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Extract parts of a string

To extract part of a `String`, use substring functions. 

Substring functions return a new `String` that contains the selected part of the original text. 
The original `String` is not modified.

### Extract by index

Use [`substring()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/substring.html) when you know the position 
of the characters you want to extract:
  
```kotlin
fun main() {
//sampleStart    
    val text = "Kotlin"
    println(text.substring(1))    // otlin
    println(text.substring(1, 5)) // otli
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The start index is **inclusive**, and the end index is **exclusive**.

### Extract around a delimiter

Use [`substringBefore()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/substring-before.html) 
and [`substringAfter()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/substring-after.html) to extract 
text relative to a delimiter:

```kotlin
fun main() { 
//sampleStart  
    val domain = "kotlinlang.org"
  
    println(domain.substringBefore(".")) // kotlinlang
    println(domain.substringAfter("."))  // org
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}


## Common string operations

Kotlin provides a range of operations for working with strings.

This section introduces some of the most commonly used operations.

> Learn more about all available functions in the
> [API Reference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/).
>
{style="note"}


### Read input into a string

* To read a single line from the standard input, use `readln()` 
  or `readlnOrNull()` (if end-of-file is possible):
 
  ```kotlin
  val firstInput = readln()
  val secondInput = readlnOrNull() // End-of-file is possible
  ```

* To read multiline input as one `String`, join it with newline characters:

  ```kotlin
  val input = generateSequence(::readlnOrNull)
      .joinToString("\n")
  ```

### Get string length

To get the number of characters in a `String`, use the
[`length`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/length.html) property:

```kotlin 
fun main (){
    //sampleStart
    val language = "Kotlin"
    println(language.length) // 6
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Inspect string content

To inspect string content, you can use functions like `contains()`, `startsWith()`, or `endsWith()`:

```kotlin
fun main() { 
//sampleStart
    val domain = "kotlinlang.org"
    
    // Checks if the string contains "."
    println(domain.contains(".")) // true
    // Checks if the string starts with "kotlin"
    println(domain.startsWith("kotlin")) // true
    // Checks if the string ends with ".org"
    println(domain.endsWith(".org"))  // true
//sampleEnd
}
 ```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Create modified copies

> Strings are immutable. Functions that change text return a new `String`.
> 
{style="note"}

To create a modified copy of a `String`, you can use functions like 
`replace()`, `uppercase()`, or `lowercase()`:

```kotlin
fun main() { 
//sampleStart
    val text = "Hello, Kotlin"
    
    // Replaces "Kotlin" with "world" 
    println(text.replace("Kotlin", "world"))  // Hello, world  
    // Converts all letters to uppercase
    println(text.uppercase()) // HELLO, KOTLIN  
    // Converts all letters to lowercase
    println(text.lowercase()) // hello, kotlin
//sampleEnd
}
 ```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}


### Split strings

* To divide a `String` into parts around a delimiter, use 
  [`split()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/split.html):

  ```kotlin
  fun main() { 
  //sampleStart
      val numbers = "one, two, three"
      println(numbers.split(", ")) // [one, two, three]
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

* To split a `String` into individual lines, use 
  [`lines()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/lines.html):

    ```kotlin
    fun main() { 
    //sampleStart
        val numbers = "one\ntwo\nthree"
        println(numbers.lines()) // [one, two, three]
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Use regular expressions

If you need to work with text patterns instead of fixed characters or delimiters, use
regular expressions
([`Regex`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-regex/)).

Regular expressions can:
* Search string content
* Check whether text matches a pattern
* Split strings by a pattern
* Replace matching parts of a string

For example, you can use [`find()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-regex/find.html) 
to return the first match of a regular expression:

```kotlin
fun main() {
//sampleStart
    val text = "User: Kotlin123"

    // Finds the first sequence of one or more digits and gets its value  
    val number = Regex("\\d+").find(text)?.value 
    println(number) // 123
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Build and format strings

> For most formatting tasks in Kotlin, use [string templates](#string-templates).
>
{style="note"}

* To build a `String` step by step, use 
  [`buildString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/build-string.html):

  ```kotlin 
  val result = buildString {
      append("Hours: ")
      append("12")
      append(", minutes: ")
      append("30")
  }
  ```

  You can use it to assemble text incrementally, for example, in loops or conditional logic.

* On the JVM, you can also format a `String` using [`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html):

  ```kotlin
  val text = String.format("Hello, %s", "Kotlin")
  ```

  > Use `String.format()` only when you specifically need formatter-style specifiers on the JVM.
  >
  > Learn more about format specifiers in the
  > [Java Class Formatter documentation](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary).
  >
  {style="note"}