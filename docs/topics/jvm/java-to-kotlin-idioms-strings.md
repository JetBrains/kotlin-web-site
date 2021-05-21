[//]: # (title: Strings idioms)

_Idiom_ is a recurring construct that provides a common approach for solving a task. In contrast to design patterns, idioms are often specific to a programming language.

In this guide you’ll find examples of how to do the same things with strings in Java and Kotlin.

## String concatenation vs string interpolation
```java
//Java
public void main() {
//sampleStart
        String name="Joe";
        System.out.println("Hello, "+name);
        System.out.println("Your name is "+name.length()+" characters long");
//sampleEnd
}
```

In Kotlin, you don’t need to use string concatenation. Just use the dollar sign $ before the variable name to [interpolate](https://kotlinlang.org/docs/idioms.html#string-interpolation) your sting:

```kotlin
//Kotlin
fun main() {
//sampleStart
    val name = "Joe"
    println("Hello, $name")
    println("Your name is ${name.length} characters long")//template expression in curly braces
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

See [string templates](https://kotlinlang.org/docs/basic-types.html#string-templates) for more information.

## Regular expressions
### Replace occurrences

Sometimes you need to replace something. Let’s imagine you want to obfuscate some data, for example, to hide the user’s login and password from logs. In Java it will look like this:

```java
//Java
String input = "login: Pokemon5, password: 1q2w3e4r5t";
Pattern pattern = Pattern.compile("\\w*\\d+\\w*");
Matcher matcher = pattern.matcher(input);
String replacementResult = matcher.replaceAll(it -> "xxx");
System.out.println("Initial input: '" + input + "'"); // Prints 'Initial input: 'login: Pokemon5, password: 1q2w3e4r5t''
System.out.println("Anonymized input: '" + replacementResult + "'"); // Prints 'Anonymized input: 'login: xxx, password: xxx''
```

In Kotlin, you can use [raw string](https://kotlinlang.org/docs/basic-types.html#string-literals) concept to simplify regex pattern and eliminate the count of slashes:
```kotlin
//Kotlin
fun main() {
//sampleStart
       val regex = Regex("""\w*\d+\w*""")//raw string
       val input = "login: Pokemon5, password: 1q2w3e4r5t"
       val replacementResult = regex.replace(input, replacement = "xxx")
       println("Initial input: '$input'") // Prints 'Initial input: 'login: Pokemon5, password: 1q2w3e4r5t''
       println("Anonymized input: '$replacementResult'") // Prints 'Anonymized input: 'login: xxx, password: xxx''
//sampleEnd
}
```
### Split a string

In Java, to split some string by the dot symbol ```.```, you need to use shielding ```\\```, because the ```split``` function in Java receives a regex string that then is compiled to an instance of ```Pattern``` class:

```java
//Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\."))); // Prints '[Sometimes, text, should, be, split]'
```

In Kotlin, you can achieve the same result easier because you can use [extension function](https://kotlinlang.org/docs/extensions.html#extension-functions) ```split```, which receives varargs of delimiters as input parameters:

```kotlin
//Kotlin
   fun main() {
//sampleStart
       println("Sometimes.text.should.be.split".split(".")) // Prints '[Sometimes, text, should, be, split]'
//sampleEnd
   }
```

## String builder

```java
//Java
StringBuilder sb = new StringBuilder();
for (int i = 5; i > 0; i--) {
sb.append(i);
sb.append("\n");
}
System.out.println(sb);
```

```kotlin
//Kotlin
   fun main() {
//sampleStart
       var counter = 5
       val s = buildString {
           repeat(5) {
               append(counter--)
               appendLine()
           }
       }
       println(s)
//sampleEnd
   }
```

## Make a string from collection items

```java
//Java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);
String oddNumbers = numbers.stream().filter(it -> it % 2 != 0).map(Object::toString).collect(Collectors.joining(", "));
System.out.println(oddNumbers);
```

In Kotlin, you don’t need to explicitly map integers to strings and use Stream API:

```kotlin
//Kotlin
   fun main() {
//sampleStart
       val numbers = mutableListOf(1, 2, 3, 4, 5, 6)
       val oddNumers = numbers.filter { it % 2 != 0 }.joinToString()
       println(oddNumers)
//sampleEnd
   }
```
## Set default value if the string is blank

What if some string is blank and a default value should be used in this case? In Java you can write it this way:

```java
//Java
public String getName() {
Random rand = new Random();
if (rand.nextBoolean()) {
return "";
} else {
return "Roman";
}
}

public void defaultValueIfStringIsBlank() {
String nameValue = getName();
String name = nameValue.isBlank() ? "John Doe" : nameValue;
System.out.println(name);
}
```

Kotlin ```Strings.kt``` provides the function ```ifBlank```, to which a default value can be supplied:

```kotlin
//Kotlin
fun getName(): String =
   if (Random.nextBoolean()) "" else "Roman"

fun main () {
   val name = getName().ifBlank { "John Doe" }
   println(name)
}
```
## Replace characters at the beginning and the end of a string
Let’s imagine you need to delete something from the beginning and the end of the string. Let it be ```##```. The same time you need to leave the ```##``` in the middle of the string. In Java it looks like this:

```java
//Java
String string = "##place##holder##";
String result = string.replaceFirst("##", "");
System.out.println(result.replaceAll("##$", ""));
```

In Kotlin, you don’t need to write regex "##$" to define the end of the string. Also you can write such replacing in one string:

```kotlin
//Kotlin
   fun main() {
//sampleStart
       val string = "##place##holder##"
       println(string.removeSurrounding("##"))
//sampleEnd
   }
```

## Substring methods

```java
//Java
String s = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
System.out.println(s.substring(s.indexOf("?") + 1));
```

In Kotlin, you don’t need to calculate the index of the symbol you want to have substring after:

```kotlin
//Kotlin   
fun substringAfterLastExample() {
//sampleStart
       val s = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42"
       println(s.substringAfter("?"))
//sampleEnd
   }
```
## Print uppercase characters from a string

```java
//Java
String s = "Hello, World!"
.chars()
.filter(Character::isUpperCase)
.collect(StringBuilder::new,
StringBuilder::appendCodePoint,
StringBuilder::append)
.toString();
System.out.println(s);
```

```kotlin
//Kotlin
print("Hello, World!".filter { it.isUpperCase() })
```
## Multi-line strings
Before Java 15, there were several ways to create a multi-line string. For example, using join() function of the String class:

```java
//Java
String lineSeparator = System.getProperty("line.separator");
String s = String.join(lineSeparator,
"Kotlin",
"Java");
System.out.println(s);
```

In Java 15 multi-lines appeared. There is one thing to keep in mind: if you print a multiline string and the triple-quote is on the next line, there will be an extra empty line:

```java
//Java
String s = """
Kotlin
Java
""".stripIndent();
System.out.println(s);
```

Output:

![Java 15 multiline output](java-15-multiline-output.png){width=500}

If you put the triple-quote on the same line as the last word, this problem will disappear.

In Kotlin, you can nicely format your line and there will be no extra empty line in the output. The beginning of the line is identified by the left-most character of any line.

```kotlin
//Kotlin
fun main() {
   val s = """
       Kotlin
          Java  
     """.trimIndent()

   println(s)
}
```

Output:

![Kotlin multiline output](kotlin-multiline-output.png){width=500}


