[//]: # (title: Characters)

<tldr>
<p><a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/">API Reference</a></p>
</tldr>

The `Char` type represents a single character as a UTF-16 code unit.

Use `Char` for individual character values, such as letters, digits, 
punctuation marks, or whitespace. For sequences of characters, use [`String`](strings.md).

> `Char` is not a numeric type, but each character has a numeric Unicode value that you can access.
> 
{style="tip"}

## Syntax 

To declare a character, use the `Char` type and enclose the value in single quotes (`' '`):

```kotlin
val letter: Char = 'a'

// Type inference also works with character literals
val digit = '1'
val symbol = '!'
val space = ' '
val separator = ':'
```

A character literal must contain exactly one character. Otherwise, Kotlin reports an error:

```kotlin
val invalid = 'AB' // Error
val invalidEmpty = '' // Error
```

### Nullable values

To store a value that can be absent, use `Char?`:

```kotlin
val maybeAbsent: Char? = null
```

> On the JVM, nullable `Char` values are boxed when needed.
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
val unicodeNumber = '\u0031' // equals '1'
```

### Supplementary characters 

Unicode characters outside the BMP, such as emojis and some historic scripts, 
cannot be represented by a single `Char`. In UTF-16, they are encoded as a **surrogate pair**.
This means, two `Char` values that together encode one Unicode character in a `String`. For example:

```kotlin
fun main() {
//sampleStart
    val emoji = "🥦"
    
    println(emoji.length) // 2
    println(emoji[0])     // first surrogate
    println(emoji[1])     // second surrogate
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

### Comparison operations 

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

### Processing characters

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

> Refer to the [API Reference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/) to see all available functions.
> 
{style="tip"}


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
    println(a)  // 'K'
    println(++a)  // 'L'
    println(--a) // 'K'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Numeric conversion

To convert `Char` to a numeric type, use explicit conversion. 

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
  
