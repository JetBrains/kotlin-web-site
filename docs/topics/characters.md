[//]: # (title: Characters)
[//]: # (description: Learn how to use the Char type in Kotlin, including syntax, Unicode support, escape sequences, and common operations on characters.)

The [`Char`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/) type represents a single character as a UTF-16 code unit.

Use `Char` for individual character values, such as letters, digits,
punctuation marks, or whitespace. For sequences of characters, use [`String`](strings.md).

> `Char` is not a numeric type, but each character has a numeric Unicode value that you can access. 
> See [](#character-conversion).
> 
{style="tip"}

## Syntax

To declare a character, enclose the value in single quotes (`' '`). You can specify the `Char` type explicitly or 
let Kotlin infer it from the value:

```kotlin
val letter: Char = 'a'

// Kotlin infers Char because the values are written in single quotes
val digit = '1'
val symbol = '!'
val space = ' '
val separator = ':'
```

A character literal must contain exactly one character. Otherwise, the Kotlin compiler reports an error:

```kotlin
val invalid = 'AB' // Error
val invalidEmpty = '' // Error
```
{validate="false"}

### Nullable values

To store a nullable value, use `Char?`:

```kotlin
val maybeAbsent: Char? = null
```

> On the JVM, nullable `Char` values are boxed when needed. The same applies to
> [numeric types](numbers.md#boxing-and-caching-numbers-on-the-jvm).
>
{style="note"}


## Unicode support

Kotlin represents `Char` values as UTF-16 code units. This means that a single `Char` stores one UTF-16 code unit,
not necessarily one complete Unicode character.

### Basic Multilingual Plane

A single `Char` can store values in the range from `\u0000` to `\uFFFF`.
This range covers the Basic Multilingual Plane (BMP) that includes characters for
almost all modern languages and a large number of symbols.

To specify a character by the Unicode value, use
`\u` followed by four-digit hexadecimal value from the
[Unicode table](https://www.unicode.org/charts/):

```kotlin
val unicodeNumber = '\u0031' // Equals '1'
```

### Supplementary characters

Unicode characters outside the BMP, such as emojis and some historic scripts,
cannot be represented by a single `Char`. In UTF-16, they are encoded as a _surrogate pair_,
where two `Char` values together represent one Unicode character in a `String`:

```kotlin
fun main() {
//sampleStart
    val emoji = "🥦"
    
    println(emoji.length) // 2
    println(emoji[0])     // First surrogate
    println(emoji[1])     // Second surrogate
//sampleEnd
}
```

> To handle 32-bit symbols individually, use Unicode code points stored as `Int` values.
>
{style="tip"}


## Escape sequences

Use escape sequences for special characters that are difficult to write directly in source code or have a
special meaning.

Every escape sequence begins with a backslash (`\`).

| **Supported sequence** | **Description**       | 
|------------------------|-----------------------|
| `\t`                   | Tab                   | 
| `\b`                   | Backspace             | 
| `\n`                   | New Line (LF)         | 
| `\r`                   | Carriage Return (CR)  | 
| `\'`                   | Single quotation mark | 
| `\"`                   | Double quotation mark |
| `\\`                   | Backslash             | 
| `\$`                   | Dollar sign           | 


For example:

```kotlin
val newLine = '\n'
val dollar = '\$'
val backslash = '\\'
```

## Operations

`Char` supports comparison, inspection, case conversion, and explicit numeric conversion.

### Character comparison

To compare `Char` values, use standard [comparison operators](keyword-reference.md#operators-and-special-symbols) such
as `==`, `!=`, `<`, `>`, `<=`, and `>=`.

Kotlin compares `Char` values by their numeric Unicode values and returns
a `Boolean` value:

```kotlin
val before = 'a' < 'b' // true
val after = 'c' > 'd' // false
val different = 'A' == 'a' // false 
val equal = 'A' == 'A' // true
```

### Character processing

Kotlin provides functions for inspection and case conversion of character values.
For example:

```kotlin
fun main() {
//sampleStart
    val myChar = 'A'
    // Checks if the character represents a digit
    println(myChar.isDigit()) // false
    // Checks if the character represents an uppercase letter
    println(myChar.isUpperCase()) // true
    // Returns a lowercase version
    println(myChar.lowercaseChar()) // 'a'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> Learn more about available functions in the 
> [API Reference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/).
>
{style="note"}


### Character arithmetic

You can create another character value by adding or subtracting an integer:

```kotlin
fun main() {
//sampleStart
    val a = 'a'

    println(a + 1)  // b
    println(a + 2)  // c
    println(a - 32) // A
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> These operations follow Unicode values, not language-specific alphabet rules.
>
{style="note"}

You can also use the increment (`++`) and decrement (`--`) operators in the prefix and postfix forms
with mutable variables:

```kotlin
fun main() {
//sampleStart
    var a = 'A'
    
    a += 10
    println(a)   // 'K'
    
    println(++a) // 'L'  prefix increment
    println(a++) // 'L'  postfix increment
    println(a)   // 'M'
    
    println(--a) // 'L'  prefix decrement
    println(a--) // 'L'  postfix decrement
    println(a)   // 'K'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Character conversion

To convert `Char` to a numeric type, use explicit conversion:

* Use `.code` to get the numeric Unicode value of a character:

  ```kotlin
  fun main() { 
  //sampleStart
      val letter = 'A'
      println(letter.code) // 65
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

* If a character represents a decimal digit, use `digitToInt()`:
  ```kotlin
  fun main() { 
  //sampleStart
      val digit = '7'
      println(digit.digitToInt()) // 7
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

  > If the character may not be a valid digit, use `digitToIntOrNull()`.
  >
  {style="tip"}