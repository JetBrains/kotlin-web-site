[//]: # (title: Nullability in Java and Kotlin)
[//]: # (description: Learn how to migrate nullable constructions from Java to Kotlin. This guide covers support for nullable types in Kotlin, how Kotlin treats nullable annotations from Java, and more.)

_Nullability_ is the ability of a variable to hold a `null` value.
When a variable contains `null`, an attempt to dereference the variable leads to a `NullPointerException`.
There are many ways to write code in order to minimize the probability of receiving null pointer exceptions.

This guide covers differences between Java's and Kotlin's approaches to handling possibly nullable variables.
It will help you migrate from Java to Kotlin and write your code in authentic Kotlin style.

The first part of this guide covers the most important difference – support for nullable types in Kotlin and
how Kotlin processes [types from Java code](#platform-types). The second part, starting from
[Checking the result of a function call](#checking-the-result-of-a-function-call), examines several specific cases to explain certain differences.

[Learn more about null safety in Kotlin](null-safety.md).

## Support for nullable types

The most important difference between Kotlin's and Java's type systems is Kotlin's explicit support for [nullable types](null-safety.md).
It is a way to indicate which variables can possibly hold a `null` value.
If a variable can be `null`, it's not safe to call a method on the variable because this can cause a `NullPointerException`.
Kotlin prohibits such calls at compile time and thereby prevents lots of possible exceptions.
At runtime, objects of nullable types and objects of non-nullable types are treated the same:
A nullable type isn't a wrapper for a non-nullable type. All checks are performed at compile time.
That means there's almost no runtime overhead for working with nullable types in Kotlin.

> We say "almost" because, even though [intrinsic](https://en.wikipedia.org/wiki/Intrinsic_function) checks _are_ generated,
their overhead is minimal.
>
{style="note"}

In Java, if you don't write null checks, methods may throw a `NullPointerException`:

```java
// Java
int stringLength(String a) {
    return a.length();
}

void main() {
    stringLength(null); // Throws a `NullPointerException`
}
```
{id="get-length-of-null-java"}

This call will have the following output:

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

In Kotlin, all regular types are non-nullable by default unless you explicitly mark them as nullable.
If you don't expect `a` to be `null`, declare the `stringLength()` function as follows:

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```
{id="get-length-kotlin"}

The parameter `a` has the `String` type, which in Kotlin means it must always contain a `String` instance and it cannot contain `null`.
Nullable types in Kotlin are marked with a question mark `?`, for example, `String?`.
The situation with a `NullPointerException` at runtime is impossible if `a` is `String` because the compiler enforces
the rule that all arguments of `stringLength()` not be `null`.

An attempt to pass a `null` value to the `stringLength(a: String)` function will result in a compile-time error,
"Null can not be a value of a non-null type String":

![Passing null to a non-nullable function error](passing-null-to-function.png){width=700}

If you want to use this function with any arguments, including `null`, use a question mark after the argument type `String?`
and check inside the function body to ensure that the value of the argument is not `null`:

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```
{id="get-length-of-null-kotlin"}

After the check is passed successfully, the compiler treats the variable as if it were of the non-nullable type `String`
in the scope where the compiler performs the check.

If you don't perform this check, the code will fail to compile with the following message:
"Only [safe (?.)](null-safety.md#safe-call-operator) or [non-nullable asserted (!!.) calls](null-safety.md#not-null-assertion-operator) are allowed
on a [nullable receiver](extensions.md#nullable-receiver) of type String?".

You can write the same shorter – use the [safe-call operator ?. (If-not-null shorthand)](idioms.md#if-not-null-shorthand), 
which allows you to combine a null check and a method call into a single operation:

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```
{id="get-length-of-null-shorter-kotlin"}

## Platform types

In Java, you can use annotations showing whether a variable can or cannot be `null`.
Such annotations aren't part of the standard library, but you can add them separately.
For example, you can use the JetBrains annotations `@Nullable` and `@NotNull` (from the `org.jetbrains.annotations` package)
or annotations from Eclipse (`org.eclipse.jdt.annotation`).
Kotlin can recognize such annotations when you're [calling Java code from Kotlin code](java-interop.md#nullability-annotations)
and will treat types according to their annotations.

If your Java code doesn't have these annotations, then Kotlin will treat Java types as _platform types_.
But since Kotlin doesn't have nullability information for such types, its compiler will allow all operations on them.
You will need to decide whether to perform null checks, because:

* Just as in Java, you'll get a `NullPointerException` if you try to perform an operation on `null`.
* The compiler won't highlight any redundant null checks, which it normally does when you perform a null-safe operation
on a value of a non-nullable type.

Learn more about [calling Java from Kotlin in regard to null-safety and platform types](java-interop.md#null-safety-and-platform-types).

## Support for definitely non-nullable types

In Kotlin, if you want to override a Java method that contains `@NotNull` as an argument, you need Kotlin's definitely
non-nullable types.

For example, consider this `load()` method in Java:

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

To override the `load()` method in Kotlin successfully, you need `T1` to be declared as definitely
non-nullable (`T1 & Any`):

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 is definitely non-nullable
  override fun load(x: T1 & Any): T1 & Any
}
```

Learn more about generic types that are [definitely non-nullable](generics.md#definitely-non-nullable-types).

## Checking the result of a function call

One of the most common situations where you need to check for `null` is when you obtain a result from a function call.

In the following example, there are two classes, `Order` and `Customer`. `Order` has a reference to an instance of `Customer`.
The `findOrder()` function returns an instance of the `Order` class, or `null` if it can't find the order.
The objective is to process the customer instance of the retrieved order.

Here are the classes in Java:

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

In Java, call the function and do an if-not-null check on the result to proceed with the dereferencing of the required property:

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```
{id="process-customer-if-not-null-java"}

Converting the Java code above to Kotlin code directly results in the following:

```kotlin
// Kotlin
data class Order(val customer: Customer)

data class Customer(val name: String)

val order = findOrder()

// Direct conversion
if (order != null){
    processCustomer(order.customer)
}
```
{id="process-customer-if-not-null-kotlin"}

Use the [safe-call operator `?.` (If-not-null shorthand)](idioms.md#if-not-null-shorthand) 
in combination with any of the [scope functions](scope-functions.md) from the standard library.
The `let` function is usually used for this:

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```
{id="process-customer-with-let-kotlin"}

Here is a shorter version of the same:

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```
{id="process-customer-with-let-short-kotlin"}

## Default values instead of null

Checking for `null` is often used in combination with [setting the default value](functions.md#default-arguments)
in case the null check is successful.

The Java code with a null check:

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```
{id="default-value-instead-of-null-java"}

To express the same in Kotlin, use the [Elvis operator (If-not-null-else shorthand)](null-safety.md#elvis-operator):

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```
{id="default-value-instead-of-null-kotlin"}

## Functions returning a value or null

In Java, you need to be careful when working with list elements. You should always check whether an element exists at
an index before you attempt to use the element:

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // Exception!
```
{id="functions-returning-null-java"}

The Kotlin standard library often provides functions whose names indicate whether they can possibly return a `null` value.
This is especially common in the collections API:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    // The same code as in Java:
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // Can throw IndexOutOfBoundsException if the collection is empty
    //numbers.get(5)     // Exception!

    // More abilities:
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null
//sampleEnd
}
```
{kotlin-runnable="true" id="functions-returning-null-kotlin"}

## Aggregate operations

When you need to get the biggest element or `null` if there are no elements, in Java you would use
the [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html):

```java
// Java
var numbers = new ArrayList<Integer>();
var max = numbers.stream().max(Comparator.naturalOrder()).orElse(null);
System.out.println("Max: " + max);
```
{id="aggregate-functions-java"}

In Kotlin, use [aggregate operations](collection-aggregate.md):

```kotlin
// Kotlin
val numbers = listOf<Int>()
println("Max: ${numbers.maxOrNull()}")
```
{id="aggregate-functions-kotlin"}

Learn more about [collections in Java and Kotlin](java-to-kotlin-collections-guide.md).

## Casting types safely

When you need to safely cast a type, in Java you would use the `instanceof` operator and then check how well it worked:

```java
// Java
int getStringLength(Object y) {
    return y instanceof String x ? x.length() : -1;
}

void main() {
    System.out.println(getStringLength(1)); // Prints `-1`
}
```
{id="casting-types-java"}

To avoid exceptions in Kotlin, use the [safe cast operator](typecasts.md#safe-nullable-cast-operator) `as?`, which returns `null` on failure:

```kotlin
// Kotlin
fun main() {
    println(getStringLength(1)) // Prints `-1`
}

fun getStringLength(y: Any): Int {
    val x: String? = y as? String // null
    return x?.length ?: -1 // Returns -1 because `x` is null
}
```
{kotlin-runnable="true" id="casting-types-kotlin"}

> In the Java example above, the function `getStringLength()` returns a result of the primitive type `int`.
To make it return `null`, you can use the [_boxed_ type](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) `Integer`.
However, it's more resource-efficient to make such functions return a negative value and then check the value –
you would do the check anyway, but no additional boxing is performed this way.
>
{style="note"}

> In Java, the unsafe type cast `(String) y` corresponds to `y as String?` in Kotlin, not `y as String`.
This is because `y as String?` only throws `ClassCastException` when the `y` is not of type `String`,
whereas `y as String` additionally throws `NullPointerException` (NPE) when `y` is `null`.
This distinction might lead to accidental NPE swallowing if using try-catch blocks designed to handle `ClassCastException`.
>
{style="warning"}

## What's next?

* Browse other [Kotlin idioms](idioms.md).
* Learn how to convert existing Java code to Kotlin with the [Java-to-Kotlin (J2K) converter](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k).
* Check out other migration guides:
  * [Strings in Java and Kotlin](java-to-kotlin-idioms-strings.md)
  * [Collections in Java and Kotlin](java-to-kotlin-collections-guide.md)

If you have a favorite idiom, feel free to share it with us by sending a pull request!
