[//]: # (title: Characters)

Characters are represented by the type `Char`.
Character literals go in single quotes: `'1'`.

> On the JVM, a character stored as primitive type: `char`, represents a 16-bit Unicode character.
>
{style="note"}

Special characters start from an escaping backslash `\`.
The following escape sequences are supported: 

* `\t` – tab
* `\b` – backspace
* `\n` – new line (LF)
* `\r` – carriage return (CR)
* `\'` – single quotation mark
* `\"` – double quotation mark
* `\\` – backslash
* `\$` – dollar sign

To encode any other character, use the Unicode escape sequence syntax: `'\uFF00'`.

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'
 
    println(aChar)
    println('\n') // Prints an extra newline character
    println('\uFF00')
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If a value of character variable is a digit, you can explicitly convert it to an `Int` number using the [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) function.

> On the JVM, characters are boxed in Java classes when a nullable reference is needed, just like with [numbers](numbers.md#numbers-representation-on-the-jvm).
> Identity is not preserved by the boxing operation.
>
{style="note"}