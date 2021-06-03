[//]: # (title: Migrating from Java to Kotlin: Strings)

This guide contains examples of how to solve typical tasks with strings in Java and Kotlin.
It will help you migrate from Java to Kotlin and write your code in the authentic Kotlin way.

## Concatenate strings

In Java, you can do this in the following way:

```java
// Java
String name = "Joe";
System.out.println("Hello, " + name);
System.out.println("Your name is " + name.length() + " characters long");
```
{id="concatenate-strings-java" lang="Java"}

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
{kotlin-runnable="true" id="concatenate-strings-kotlin" lang="Kotlin"}

You can interpolate the value of a complicated expression by surrounding it with curly braces, like in `${name.length}`.
See [string templates](https://kotlinlang.org/docs/basic-types.html#string-templates) for more information.

## Build a string

In Java, you can use the [StringBuilder](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/StringBuilder.html):

```java
// Java
StringBuilder countDown = new StringBuilder();
for (int i = 5; i > 0; i--) {
    countDown.append(i);
    countDown.append("\n");
}
System.out.println(countDown);
```

In Kotlin, use [buildString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) –
an [inline function](https://kotlinlang.org/docs/inline-functions.html) that takes logic to construct a string as a lambda argument:

```kotlin
fun main() {
//sampleStart
       // Kotlin
       var counter = 5;
       val countDown = buildString {
           repeat(5) {
               append(counter--)
               appendLine()
           }
       }
       println(countDown)
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-build-string"}

Under the hood, the `buildString` uses the same `StringBuilder` class as in Java, and you access it via an implicit `this`
inside the [lambda](https://kotlinlang.org/docs/lambdas.html#function-literals-with-receiver).

Learn more about [lambda coding conventions](https://kotlinlang.org/docs/coding-conventions.html#lambdas).

## Create a string from collection items

In Java, you use the [Stream API](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html) to filter,
map, and then collect the items:

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

In Kotlin, use the [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) function,
which Kotlin defines for every List:

```kotlin
fun main() {
//sampleStart
       // Kotlin
       val numbers = mutableListOf(1, 2, 3, 4, 5, 6)
       val oddNumbers = numbers.filter { it % 2 != 0 }
 .joinToString{ it.unaryMinus().toString() }
       println(oddNumbers)
//sampleEnd
}
```
{kotlin-runnable="true"}

## Set default value if the string is blank

In Java, you can use the ternary operator:

```java
// Java
public void defaultValueIfStringIsBlank() {
   String nameValue = getName();
   String name = nameValue.isBlank() ? "John Doe" : nameValue;
   System.out.println(name);
}

public String getName() {
   Random rand = new Random();
   return rand.nextBoolean() ? "" : "Roman";
}
```

Kotlin provides the inline function [ifBlank()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/if-blank.html)
that consumes the default value as an argument:

```kotlin
// Kotlin
import kotlin.random.Random

fun main () {
   val name = getName().ifBlank { "John Doe" }
   println(name)
}

fun getName(): String =
   if (Random.nextBoolean()) "" else "Roman"
```
{kotlin-runnable="true"}

## Replace characters at the beginning and end of a string

In Java, you can use the `replaceFirst()` and the `replaceAll()` functions.
The `replaceAll()` function in this case consumes the regular expression `##$`, which defines a string ending with `##`:

```java
// Java
String input = "##place##holder##";
String result = input.replaceFirst("##", "").replaceAll("##$", "");
System.out.println(result);
```

In Kotlin, use the `removeSurrounding()` function with the string delimiter `##`:

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
{kotlin-runnable="true"}

## Replace occurrences

In Java, you can use the [Pattern](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/util/regex/Pattern.html)
and the [Matcher](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/util/regex/Matcher.html) classes,
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

In Kotlin, you use the [Regex](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/) class
that simplifies working with regular expressions.
Additionally, use [raw strings](https://kotlinlang.org/docs/basic-types.html#string-literals) to simplify a regex pattern
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
{kotlin-runnable="true"}

## Split a string

In Java, to split a string with the period character (`.`), you need to use shielding (`\\`).
This happens because the [split()](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/String.html#split(java.lang.String))
function of the `String` class accepts a regular expression as an argument:

```java
// Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\.")));
```

In Kotlin, use the Kotlin function [split()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html),
which receives varargs of delimiters as input parameters:

```kotlin
   fun main() {
//sampleStart
       // Kotlin
       println("Sometimes.text.should.be.split".split("."))
//sampleEnd
   }
```
{kotlin-runnable="true"}

If you need to split with a regular expression, use the overloaded `split()` version that consumes the `Regex` as a parameter.

## Take a substring

In Java, you can use the [substring()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#substring(int)) function,
which takes an inclusive begin index of a character to start taking substring from.
To take a substring after this character, you need to increment the index:

```java
// Java
String input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
String answer = input.substring(input.indexOf("?") + 1);
System.out.println(answer);
```

In Kotlin, you use the `substringAfter()` function and don’t need to calculate the index of the character you want
to take a substring after:

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
{kotlin-runnable="true"}

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
{kotlin-runnable="true"}

## Print uppercase characters from a string

In Java:

```java
// Java
String initials = "František Xaver Svoboda"
       .chars()
       .filter(Character::isUpperCase)
       .collect(StringBuilder::new,
               StringBuilder::appendCodePoint,
               StringBuilder::append)
       .toString();
System.out.println(initials);
```

In Kotlin:

```kotlin
fun main() {
//sampleStart
   // Kotlin
   val initials = "František Xaver Svoboda".filter { it.isUpperCase() }
   println(initials)
//sampleEnd
}
```
{kotlin-runnable="true"}

## Use multiline strings

Before Java 15, there were several ways to create a multiline string. For example, using
the [join()](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/String.html#join(java.lang.CharSequence,java.lang.CharSequence...))
function of the `String` class:

```java
// Java
String lineSeparator = System.getProperty("line.separator");
String result = String.join(lineSeparator,
       "Kotlin",
       "Java");
System.out.println(result);
```

In Java 15, text blocks appeared. There is one thing to keep in mind: if you print a multiline string
and the triple-quote is on the next line, there will be an extra empty line:

```java
// Java
   String result = """
       Kotlin
       Java
       """.stripIndent();
   System.out.println(result);
```

The output:
![Java 15 multiline output](java-15-multiline-output.png){width=500}

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
{kotlin-runnable="true"}

The output:
![Kotlin multiline output](kotlin-multiline-output.png){width=500}

In Kotlin, you can also use the `trimMargin()` function to customize the indents:

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
{kotlin-runnable="true"}

Learn more about [multiline strings](https://kotlinlang.org/docs/coding-conventions.html#strings).

## What’s next?

* Look through other [Kotlin idioms](https://kotlinlang.org/docs/idioms.html).
* Learn how to convert existing Java code to Kotlin with
  [Java to Kotlin converter](https://kotlinlang.org/docs/mixing-java-kotlin-intellij.html#converting-an-existing-java-file-to-kotlin-with-j2k).

If you have a favorite idiom, contribute it by sending a pull request.
