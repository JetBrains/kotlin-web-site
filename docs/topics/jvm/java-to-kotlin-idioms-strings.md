[//]: # (title: Migrating from Java to Kotlin: Strings)

This guide contains examples of how to perform typical tasks with strings in Java and Kotlin.
It will help you migrate from Java to Kotlin and write your code in the authentic Kotlin way.

## Concatenate strings

In Java, you can do this in the following way:

```java
// Java
String name = "Joe";
System.out.println("Hello, " + name);
System.out.println("Your name is " + name.length() + " characters long");
```
{id="concatenate-strings-java"}

In Kotlin, use the dollar sign (`$`) before the variable name to interpolate the value of this variable into your string:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val name = "Joe"
    println("Hello, $name")
    println("Your name is ${name.length} characters long")
//sampleEnd
}
```
{kotlin-runnable="true" id="concatenate-strings-kotlin"}

You can interpolate the value of a complicated expression by surrounding it with curly braces, like in `${name.length}`.
See [string templates](basic-types.md#string-templates) for more information.

## Build a string

In Java, you can use the [StringBuilder](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/StringBuilder.html):

```java
// Java
StringBuilder countDown = new StringBuilder();
for (int i = 5; i > 0; i--) {
    countDown.append(i);
    countDown.append("\n");
}
System.out.println(countDown);
```
{id="build-string-java"}

In Kotlin, use [buildString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) –
an [inline function](inline-functions.md) that takes logic to construct a string as a lambda argument:

```kotlin
fun main() {
//sampleStart
       // Kotlin
       val countDown = buildString {
           for (i in 5 downTo 1) {
               append(i)
               appendLine()
           }
       }
       println(countDown)
//sampleEnd
}
```
{kotlin-runnable="true" id="build-string-kotlin"}

Under the hood, the `buildString` uses the same `StringBuilder` class as in Java, and you access it via an implicit `this`
inside the [lambda](lambdas.md#function-literals-with-receiver).

Learn more about [lambda coding conventions](coding-conventions.md#lambdas).

## Create a string from collection items

In Java, you use the [Stream API](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/package-summary.html) 
to filter, map, and then collect the items:

```java
// Java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);
String oddNumbers = numbers
        .stream()
        .filter(it -> it % 2 != 0)
        .map(it -> (-1) * it)
        .map(Object::toString)
        .collect(Collectors.joining(", "));
System.out.println(oddNumbers);
```
{id="create-string-from-collection-java"}

In Kotlin, use the [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) function,
which Kotlin defines for every List:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = mutableListOf(1, 2, 3, 4, 5, 6)
    val oddNumbers = numbers
        .filter { it % 2 != 0 }
        .joinToString{ "${-it}" }
  println(oddNumbers)
//sampleEnd
}
```
{kotlin-runnable="true"  id="create-string-from-collection-kotlin"}

## Set default value if the string is blank

In Java, you can use the [ternary operator](https://en.wikipedia.org/wiki/%3F:):

```java
// Java
public void defaultValueIfStringIsBlank() {
    String nameValue = getName();
    String name = nameValue.isBlank() ? "John Doe" : nameValue;
    System.out.println(name);
}

public String getName() {
    Random rand = new Random();
    return rand.nextBoolean() ? "" : "David";
}
```
{id="set-default-value-if-blank-java"}

Kotlin provides the inline function [ifBlank()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/if-blank.html)
that accepts the default value as an argument:

```kotlin
// Kotlin
import kotlin.random.Random

//sampleStart
fun main() {
    val name = getName().ifBlank { "John Doe" }
    println(name)
}

fun getName(): String =
    if (Random.nextBoolean()) "" else "David"
//sampleEnd
```
{kotlin-runnable="true" id="set-default-value-if-blank-kotlin"}

## Replace characters at the beginning and end of a string

In Java, you can use 
the [replaceFirst()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#replaceFirst(java.lang.String,java.lang.String)) 
and the [replaceAll()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#replaceAll(java.lang.String,java.lang.String)) 
functions.
The `replaceAll()` function in this case accepts the regular expression `##$`, which defines a string ending with `##`:

```java
// Java
String input = "##place##holder##";
String result = input.replaceFirst("##", "").replaceAll("##$", "");
System.out.println(result);
```
{id="replace-characters-java"}

In Kotlin, use the [removeSurrounding()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/remove-surrounding.html) 
function with the string delimiter `##`:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val input = "##place##holder##"
    val result = input.removeSurrounding("##")
    println(result)
//sampleEnd
}
```
{kotlin-runnable="true" id="replace-characters-kotlin"}

## Replace occurrences

In Java, you can use the [Pattern](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html)
and the [Matcher](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Matcher.html) classes,
for example, to obfuscate some data:

```java
// Java
String input = "login: Pokemon5, password: 1q2w3e4r5t";
Pattern pattern = Pattern.compile("\\w*\\d+\\w*");
Matcher matcher = pattern.matcher(input);
String replacementResult = matcher.replaceAll(it -> "xxx");
System.out.println("Initial input: '" + input + "'");
System.out.println("Anonymized input: '" + replacementResult + "'");
```
{id="replace-occurrences-java"}

In Kotlin, you use the [Regex](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/) class
that simplifies working with regular expressions.
Additionally, use [raw strings](basic-types.md#string-literals) to simplify a regex pattern
by reducing the count of backslashes:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val regex = Regex("""\w*\d+\w*""") // raw string
    val input = "login: Pokemon5, password: 1q2w3e4r5t"
    val replacementResult = regex.replace(input, replacement = "xxx")
    println("Initial input: '$input'")
    println("Anonymized input: '$replacementResult'")
//sampleEnd
}
```
{kotlin-runnable="true" id="replace-occurrences-kotlin"}

## Split a string

In Java, to split a string with the period character (`.`), you need to use shielding (`\\`).
This happens because the [split()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#split(java.lang.String))
function of the `String` class accepts a regular expression as an argument:

```java
// Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\.")));
```
{id="split-string-java"}

In Kotlin, use the Kotlin function [split()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html),
which accepts varargs of delimiters as input parameters:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    println("Sometimes.text.should.be.split".split("."))
//sampleEnd
}
```
{kotlin-runnable="true" id="split-string-kotlin"}

If you need to split with a regular expression, use the overloaded `split()` version that accepts the `Regex` as a parameter.

## Take a substring

In Java, you can use the [substring()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#substring(int)) function,
which accepts an inclusive beginning index of a character to start taking the substring from.
To take a substring after this character, you need to increment the index:

```java
// Java
String input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
String answer = input.substring(input.indexOf("?") + 1);
System.out.println(answer);
```
{id="take-substring-java"}

In Kotlin, you use the [substringAfter()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring-after.html) function 
and don’t need to calculate the index of the character you want to take a substring after:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42"
    val answer = input.substringAfter("?")
    println(answer)
//sampleEnd
}
```
{kotlin-runnable="true" id="take-substring-kotlin"}

Additionally, you can take a substring after the last occurrence of a character:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val input = "To be, or not to be, that is the question."
    val question = input.substringAfterLast(",")
    println(question)
//sampleEnd
}
```
{kotlin-runnable="true" id="take-substring-after-last-kotlin"}

## Use multiline strings

Before Java 15, there were several ways to create a multiline string. For example, using
the [join()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#join(java.lang.CharSequence,java.lang.CharSequence...))
function of the `String` class:

```java
// Java
String lineSeparator = System.getProperty("line.separator");
String result = String.join(lineSeparator,
       "Kotlin",
       "Java");
System.out.println(result);
```
{id="join-strings-11-java"}

In Java 15, [text blocks](https://docs.oracle.com/en/java/javase/15/text-blocks/index.html) appeared. 
There is one thing to keep in mind: if you print a multiline string and the triple-quote is on the next line, 
there will be an extra empty line:

```java
// Java
String result = """
    Kotlin
    Java
    """.stripIndent();
System.out.println(result);
```
{id="join-strings-15-java"}

The output:
![Java 15 multiline output](java-15-multiline-output.png){width=700}

If you put the triple-quote on the same line as the last word, this difference in behavior disappears.

In Kotlin, you can format your line with the quotes on the new line, and there will be no extra empty line in the output.
The left-most character of any line identifies the beginning of the line.

```kotlin
fun main() {
//sampleStart
    // Kotlin   
    val result = """
        Kotlin
        Java 
    """.trimIndent()
    println(result)
//sampleEnd
}
```
{kotlin-runnable="true" id="join-strings-kotlin"}

The output:
![Kotlin multiline output](kotlin-multiline-output.png){width=700}

In Kotlin, you can also use the [trimMargin()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) function to customize the indents:

```kotlin
// Kotlin
fun main() {
    val result = """
       #  Kotlin
       #  Java
   """.trimMargin("#")
    println(result)
}
```
{kotlin-runnable="true" id="join-strings-trim-margin-kotlin"}

Learn more about [multiline strings](coding-conventions.md#strings).

## What’s next?

* Look through other [Kotlin idioms](idioms.md).
* Learn how to convert existing Java code to Kotlin with
  [Java to Kotlin converter](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k).

If you have a favorite idiom, contribute it by sending a pull request.
