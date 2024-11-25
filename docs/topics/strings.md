[//]: # (title: Strings)

Strings in Kotlin are represented by the type [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/). 

> On the JVM, an object of `String` type in UTF-16 encoding uses approximately 2 bytes per character.
> 
{style="note"}

Generally, a string value is a sequence of characters in double quotes (`"`):

```kotlin
val str = "abcd 123"
```

Elements of a string are characters that you can access via the indexing operation: `s[i]`.
You can iterate over these characters with a `for` loop:

```kotlin
fun main() {
    val str = "abcd" 
//sampleStart
    for (c in str) {
        println(c)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Strings are immutable. Once you initialize a string, you can't change its value or assign a new value to it.
All operations that transform strings return their results in a new `String` object, leaving the original string unchanged:

```kotlin
fun main() {
//sampleStart
    val str = "abcd"
   
    // Creates and prints a new String object
    println(str.uppercase())
    // ABCD
   
    // The original string remains the same
    println(str) 
    // abcd
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To concatenate strings, use the `+` operator. This also works for concatenating strings with values of other types, as long
as the first element in the expression is a string:

```kotlin
fun main() {
//sampleStart
    val s = "abc" + 1
    println(s + "def")
    // abc1def    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> In most cases using [string templates](#string-templates) or [multiline strings](#multiline-strings) is preferable to string concatenation.
> 
{style="note"}

## String literals

Kotlin has two types of string literals:

* [Escaped strings](#escaped-strings)
* [Multiline strings](#multiline-strings)

### Escaped strings

_Escaped strings_ can contain escaped characters.  
Here's an example of an escaped string:

```kotlin
val s = "Hello, world!\n"
```

Escaping is done in the conventional way, with a backslash (`\`).  
See [Characters](characters.md) page for the list of supported escape sequences.

### Multiline strings

_Multiline strings_ can contain newlines and arbitrary text. It is delimited by a triple quote (`"""`),
contains no escaping and can contain newlines and any other characters:

```kotlin
val text = """
    for (c in "foo")
        print(c)
    """
```

To remove leading whitespace from multiline strings, use the [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) function:

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

By default, a pipe symbol `|` is used as margin prefix, but you can choose another character and pass it as a parameter, like `trimMargin(">")`.

## String templates

String literals may contain _template expressions_ – pieces of code that are evaluated and whose results are concatenated into a string.
When a template expression is processed, Kotlin automatically calls the `.toString()` function on the expression's result
to convert it into a string. A template expression starts with a dollar sign (`$`) and consists of either a variable name:

```kotlin
fun main() {
//sampleStart
    val i = 10
    println("i = $i") 
    // i = 10
    
    val letters = listOf("a","b","c","d","e")
    println("Letters: $letters") 
    // Letters: [a, b, c, d, e]

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

or an expression in curly braces:

```kotlin
fun main() {
//sampleStart
    val s = "abc"
    println("$s.length is ${s.length}") 
    // abc.length is 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can use templates both in multiline and escaped strings.
To insert the dollar sign `$` in a multiline string (which doesn't support backslash escaping) before any symbol,
which is allowed as a beginning of an [identifier](https://kotlinlang.org/docs/reference/grammar.html#identifiers),
use the following syntax:

```kotlin
val price = """
${'$'}_9.99
"""
```

> To avoid `${'$'}` sequences in multiline strings, you can use Experimental [multi-dollar string interpolation feature](#multi-dollar-string-interpolation).
>
{style="note"}

### Multi-dollar string interpolation

> The multi-dollar string interpolation is [Experimental](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained).
> It may be changed at any time. We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425).
>
{style="warning"}

Multiline strings in Kotlin don't support backslash escaping for literals. To escape dollar signs (`$`), 
you need to use the `${'$'}` construct to prevent string interpolation.
This approach can make the code harder to read, especially when the string contains multiple dollar signs.

The multi-dollar string interpolation feature allows you to specify how many consecutive dollar signs are needed to trigger interpolation.
This lets you treat dollar signs as literal characters in multiline strings.  
For example:

```kotlin
val KClass<*>.jsonSchema : String
    get() = $$"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "$${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

Here, the use of `$$` before the multiline string means that only two consecutive dollar signs trigger string interpolation,
while single dollar signs remain as literal characters.

You can specify how many dollar signs trigger interpolation.
For example, you can use three consecutive dollar signs `$$$` to trigger string interpolation:

```kotlin
val requestData =
    $$$"""{
      "currency": "$",
      "enteredAmount": "42.45 $$",
      "$$serviceField": "none",
      "product": "$$$productName"
    }
    """
```

To enable the feature, use the following compiler option in the command line:

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

Alternatively, update the `compilerOptions {}` block of your Gradle build file:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

This feature doesn't affect existing code that uses single-dollar string interpolation. 
You can continue using single `$`
as before and apply multi-dollar signs when you need to handle literal dollar signs in strings.

## String formatting

> String formatting with the `String.format()` function is only available in Kotlin/JVM.
>
{style="note"}

To format a string to your specific requirements, use the [`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html) 
function. 

The `String.format()` function accepts a format string and one or more arguments. The format string contains one placeholder 
(indicated by `%`) for a given argument, followed by format specifiers.
Format specifiers are formatting instructions for the respective argument, consisting of flags, width, precision, and 
conversion type. Collectively, format specifiers shape the output's formatting. Common format specifiers include 
`%d` for integers, `%f` for floating-point numbers, and `%s` for strings. You can also use the `argument_index$` syntax 
to reference the same argument multiple times within the format string in different formats.

> For a detailed understanding and an extensive list of format specifiers, see [Java's Class Formatter documentation](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary).
>
{style="note"}

Let's look at an example:

```kotlin
fun main() { 
//sampleStart
    // Formats an integer, adding leading zeroes to reach a length of seven characters
    val integerNumber = String.format("%07d", 31416)
    println(integerNumber)
    // 0031416

    // Formats a floating-point number to display with a + sign and four decimal places
    val floatNumber = String.format("%+.4f", 3.141592)
    println(floatNumber)
    // +3.1416

    // Formats two strings to uppercase, each taking one placeholder
    val helloString = String.format("%S %S", "hello", "world")
    println(helloString)
    // HELLO WORLD
    
    // Formats a negative number to be enclosed in parentheses, then repeats the same number in a different format (without parentheses) using `argument_index$`.
    val negativeNumberInParentheses = String.format("%(d means %1\$d", -31416)
    println(negativeNumberInParentheses)
    //(31416) means -31416
//sampleEnd    
}
```
{interpolate-variables="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The `String.format()` function provides similar functionality to string templates. However, the 
`String.format()` function is more versatile because there are more formatting options available. 

In addition, you can assign the format string from a variable. This can be useful when the format string changes, 
for example, in localization cases that depend on the user locale.

Be careful when using the `String.format()` function because it can be easy to mismatch the number or position of the 
arguments with their corresponding placeholders.


---

```kotlin
// build.gradle.kts
dependencies {
    myCompilerScope("org.jetbrains.kotlin:kotlin-compiler-embeddable:%kotlinVersion")
}
```
