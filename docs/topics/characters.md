[//]: # (title: Characters)

Characters are represented by the type `Char`. Character literals go in single quotes: `'1'`.

Special characters start from an escaping backslash `\`.
The following escape sequences are supported: `\t`, `\b`, `\n`, `\r`, `\'`, `\"`, `\\` and `\$`.

To encode any other character, use the Unicode escape sequence syntax: `'\uFF00'`.

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'
 
    println(aChar)
    println('\n') //prints an extra newline character
    println('\uFF00')
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If a value of character variable is a digit, you can explicitly convert it to an `Int` number using the [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) function.

>**On JVM**: Like [numbers](numbers.md#numbers-representation-on-the-jvm), characters are boxed when a nullable reference is needed.
>Identity is not preserved by the boxing operation.
>
{type="note"}