[//]: # (title: Strings)
[//]: # (description: Learn how to work with strings in Kotlin, including string literals, string templates, multiline strings, and common text operations.)

The [`String`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/) type represents a sequence of
[characters](characters.md). 

Use `String` for text values, such as words, sentences, messages, or structured text. 

The `String` type is immutable. 

## Declare strings

To declare a `String` literal, enclose the value in double quotes (`""`). 

You can specify the `String` type explicitly or let Kotlin infer it from the value:

```kotlin
val name: String = "Kotlin"
val message = "Hello, world!" // Kotlin infers String
```

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

### Multiline strings

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

String templates let you embed variables and expressions directly inside a `String` literal. 
This process is called _interpolation_. 

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

If an interpolated expression or variable evaluates to `null`, the Kotlin compiler 
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

## Basic string operations

Kotlin provides a range of operations for working with strings.

This section introduces some of the most commonly used operations.

> Learn more about all available functions in the
> [API Reference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/).

Since the `String` type is immutable, you cannot change its contents. 
String operations return new strings with modifications applied and do not update
the original variable. 

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

### Access characters by index

To access an individual character in a `String`, 
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

### Extract parts of a string

To extract part of a `String`, use
[`substring()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/substring.html) functions
or [`subSequence()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/sub-sequence.html). 

Substring functions return a new `String` that contains the selected part of the original text. 
The original `String` is not modified.

For example:
  
```kotlin
fun main() {
//sampleStart    
    val text = "Kotlin"
    println(text.substring(1))    // otlin
    println(text.substring(1, 5)) // otli
    println(text.subSequence(1, 5)) // otli
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