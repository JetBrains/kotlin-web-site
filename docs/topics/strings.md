[//]: # (title: Strings)

Strings in Kotlin are represented by the type `String`. Generally, a string value is a sequence of characters in double quotes (`"`).

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
All operations that transform strings return their results in a new `String` object, leaving the original string unchanged.

```kotlin
fun main() {
//sampleStart
    val str = "abcd"
    println(str.uppercase()) // Create and print a new String object
    println(str) // the original string remains the same
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
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Note that in most cases using [string templates](#string-templates) or raw strings is preferable to string concatenation.

## String literals

Kotlin has two types of string literals:

* _escaped_ strings that may contain escaped characters
* _raw_ strings that can contain newlines and arbitrary text

Here's an example of an escaped string:

```kotlin
val s = "Hello, world!\n"
```

Escaping is done in the conventional way, with a backslash (`\`). See [Characters](characters.md) page for the list of supported escape sequences.

A raw string is delimited by a triple quote (`"""`), contains no escaping and can contain newlines and any other characters:

```kotlin
val text = """
    for (c in "foo")
        print(c)
"""
```

To remove leading whitespace from raw strings, use the [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) function:

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

By default, `|` is used as margin prefix, but you can choose another character and pass it as a parameter, like `trimMargin(">")`.

## String templates

String literals may contain _template_ expressions - pieces of code that are evaluated and whose results are concatenated into the string.
A template expression starts with a dollar sign (`$`) and consists of either a name:

```kotlin
fun main() {
//sampleStart
    val i = 10
    println("i = $i") // prints "i = 10"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

or an expression in curly braces:

```kotlin
fun main() {
//sampleStart
    val s = "abc"
    println("$s.length is ${s.length}") // prints "abc.length is 3"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can use templates both in raw and escaped strings.
To insert the `$` character in a raw string (which doesn't support backslash escaping) before any symbol, which is allowed as a beginning of an [identifier](https://kotlinlang.org/docs/reference/grammar.html#identifiers), use the following syntax:

```kotlin
val price = """
${'$'}_9.99
"""
```