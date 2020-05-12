---
type: doc
layout: reference
category: "Java Interop"
title: "Calling Kotlin from Java"
---

# Calling Kotlin from Java

Kotlin code can be easily called from Java.
For example, instances of a Kotlin class can be seamlessly created and operated in Java methods.
However, there are certain differences between Java and Kotlin that require attention when
integrating Kotlin code into Java. 
On this page, we'll describe the ways to tailor the interop of your Kotlin code with its Java clients.


## Properties

A Kotlin property is compiled to the following Java elements:

 * A getter method, with the name calculated by prepending the `get` prefix;
 * A setter method, with the name calculated by prepending the `set` prefix (only for `var` properties);
 * A private field, with the same name as the property name (only for properties with backing fields).

For example, `var firstName: String` gets compiled to the following Java declarations:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
private String firstName;

public String getFirstName() {
    return firstName;
}

public void setFirstName(String firstName) {
    this.firstName = firstName;
}
```
</div>

If the name of the property starts with `is`, a different name mapping rule is used: the name of the getter will be
the same as the property name, and the name of the setter will be obtained by replacing `is` with `set`.
For example, for a property `isOpen`, the getter will be called `isOpen()` and the setter will be called `setOpen()`.
This rule applies for properties of any type, not just `Boolean`.

## Package-level functions

All the functions and properties declared in a file `app.kt` inside a package `org.example`, including extension functions,
are compiled into static methods of a Java class named `org.example.AppKt`.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// app.kt
package org.example

class Util

fun getTime() { /*...*/ }

```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java
new org.example.Util();
org.example.AppKt.getTime();
```
</div>

The name of the generated Java class can be changed using the `@JvmName` annotation:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@file:JvmName("DemoUtils")

package org.example

class Util

fun getTime() { /*...*/ }

```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java
new org.example.Util();
org.example.DemoUtils.getTime();
```
</div>

Having multiple files which have the same generated Java class name (the same package and the same name or the same
[`@JvmName`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) annotation) is normally an error.
However, the compiler has the ability to generate a single Java facade class which has the specified name and contains all the declarations from all the files which have that name.
To enable the generation of such a facade, use the [`@JvmMultifileClass`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html) annotation in all of the files.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// oldutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getTime() { /*...*/ }
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// newutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getDate() { /*...*/ }
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java
org.example.Utils.getTime();
org.example.Utils.getDate();
```
</div>

## Instance fields

If you need to expose a Kotlin property as a field in Java, annotate it with the [`@JvmField`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) annotation.
The field will have the same visibility as the underlying property. You can annotate a property with `@JvmField`
if it has a backing field, is not private, does not have `open`, `override` or `const` modifiers, and is not a delegated property.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class User(id: String) {
    @JvmField val ID = id
}
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java
class JavaClient {
    public String getID(User user) {
        return user.ID;
    }
}
```
</div>

[Late-Initialized](properties.html#late-initialized-properties-and-variables) properties are also exposed as fields. 
The visibility of the field will be the same as the visibility of `lateinit` property setter.

## Static fields

Kotlin properties declared in a named object or a companion object will have static backing fields
either in that named object or in the class containing the companion object.

Usually these fields are private but they can be exposed in one of the following ways:

 - [`@JvmField`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) annotation;
 - `lateinit` modifier;
 - `const` modifier.
 
Annotating such a property with `@JvmField` makes it a static field with the same visibility as the property itself.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Key(val value: Int) {
    companion object {
        @JvmField
        val COMPARATOR: Comparator<Key> = compareBy<Key> { it.value }
    }
}
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java
Key.COMPARATOR.compare(key1, key2);
// public static final field in Key class
```
</div>

A [late-initialized](properties.html#late-initialized-properties-and-variables) property in an object or a companion object
has a static backing field with the same visibility as the property setter.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
object Singleton {
    lateinit var provider: Provider
}
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java
Singleton.provider = new Provider();
// public static non-final field in Singleton class
```
</div>

Properties declared as `const` (in classes as well as at the top level) are turned into static fields in Java:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// file example.kt

object Obj {
    const val CONST = 1
}

class C {
    companion object {
        const val VERSION = 9
    }
}

const val MAX = 239
```
</div>

In Java:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
int const = Obj.CONST;
int max = ExampleKt.MAX;
int version = C.VERSION;
```
</div>

## Static methods

As mentioned above, Kotlin represents package-level functions as static methods.
Kotlin can also generate static methods for functions defined in named objects or companion objects if you annotate those functions as [`@JvmStatic`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/index.html).
If you use this annotation, the compiler will generate both a static method in the enclosing class of the object and an instance method in the object itself.
For example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class C {
    companion object {
        @JvmStatic fun callStatic() {}
        fun callNonStatic() {}
    }
}
```
</div>

Now, `callStatic()` is static in Java, while `callNonStatic()` is not:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
C.callStatic(); // works fine
C.callNonStatic(); // error: not a static method
C.Companion.callStatic(); // instance method remains
C.Companion.callNonStatic(); // the only way it works
```
</div>

Same for named objects:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
object Obj {
    @JvmStatic fun callStatic() {}
    fun callNonStatic() {}
}
```
</div>

In Java:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
Obj.callStatic(); // works fine
Obj.callNonStatic(); // error
Obj.INSTANCE.callNonStatic(); // works, a call through the singleton instance
Obj.INSTANCE.callStatic(); // works too
```
</div>

Starting from Kotlin 1.3, `@JvmStatic` applies to functions defined in companion objects of interfaces as well.
Such functions compile to static methods in interfaces. Note that static method in interfaces were introduced in Java 1.8,
so be sure to use the corresponding targets.  

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```
</div>

`@JvmStatic` annotation can also be applied on a property of an object or a companion object
making its getter and setter methods static members in that object or the class containing the companion object.

## Default methods in interfaces

> Default methods are available only for targets JVM 1.8 and above.
{:.note}

> The `@JvmDefault` annotation is experimental in Kotlin 1.3. Its name and behavior may change, leading to future incompatibility.
{:.note}

Starting from JDK 1.8, interfaces in Java can contain [default methods](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html).
You can declare a non-abstract member of a Kotlin interface as default for the Java classes implementing it.
To make a member default, mark it with the [`@JvmDefault`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html) annotation.
Here is an example of a Kotlin interface with a default method:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface Robot {
    @JvmDefault fun move() { println("~walking~") }
    fun speak(): Unit
}
```
</div>

The default implementation is available for Java classes implementing the interface.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```java
//Java implementation
public class C3PO implements Robot {
    // move() implementation from Robot is available implicitly
    @Override
    public void speak() {
        System.out.println("I beg your pardon, sir");
    }
}
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```java
C3PO c3po = new C3PO();
c3po.move(); // default implementation from the Robot interface
c3po.speak();
```
</div>

Implementations of the interface can override default methods.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```java
//Java
public class BB8 implements Robot {
    //own implementation of the default method
    @Override
    public void move() {
        System.out.println("~rolling~");
    }

    @Override
    public void speak() {
        System.out.println("Beep-beep");
    }
}
```
</div>

For the `@JvmDefault` annotation to take effect, the interface must be compiled with an `-Xjvm-default` argument.
Depending on the case of adding the annotation, specify one of the argument values:

* `-Xjvm-default=enabled` should be used if you add only new methods with the `@JvmDefault` annotation.
   This includes adding the entire interface for your API.
* `-Xjvm-default=compatibility` should be used if you are adding a `@JvmDefault` to the methods that were available in the API before.
   This mode helps avoid compatibility breaks: all the interface implementations written for the previous versions will be fully compatible with the new version.
   However, the compatibility mode may add some overhead to the resulting bytecode size and affect the performance.

For more details about compatibility issues, see the `@JvmDefault` [reference page](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html).

### Using in delegates

Note that if an interface with `@JvmDefault` methods is used as a [delegate](/docs/reference/delegation.html),
the default method implementations are called even if the actual delegate type provides its own implementations.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface Producer {
    @JvmDefault fun produce() {
        println("interface method")
    }
}

class ProducerImpl: Producer {
    override fun produce() {
        println("class method")
    }
}

class DelegatedProducer(val p: Producer): Producer by p {
}

fun main() {
    val prod = ProducerImpl()
    DelegatedProducer(prod).produce() // prints "interface method"
}
```
</div>

For more details about interface delegation in Kotlin, see [Delegation](/docs/reference/delegation.html).


## Visibility

The Kotlin visibilities are mapped to Java in the following way:

* `private` members are compiled to `private` members;
* `private` top-level declarations are compiled to package-local declarations;
* `protected` remains `protected` (note that Java allows accessing protected members from other classes in the same package
and Kotlin doesn't, so Java classes will have broader access to the code);
* `internal` declarations become `public` in Java. Members of `internal` classes go through name mangling, to make
it harder to accidentally use them from Java and to allow overloading for members with the same signature that don't see
each other according to Kotlin rules;
* `public` remains `public`.

## KClass

Sometimes you need to call a Kotlin method with a parameter of type `KClass`.
There is no automatic conversion from `Class` to `KClass`, so you have to do it manually by invoking the equivalent of
the `Class<T>.kotlin` extension property:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```
</div>

## Handling signature clashes with `@JvmName`

Sometimes we have a named function in Kotlin, for which we need a different JVM name in the byte code.
The most prominent example happens due to *type erasure*:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```
</div>

These two functions can not be defined side-by-side, because their JVM signatures are the same: `filterValid(Ljava/util/List;)Ljava/util/List;`.
If we really want them to have the same name in Kotlin, we can annotate one (or both) of them with [`@JvmName`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) and specify a different name as an argument:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```
</div>

From Kotlin they will be accessible by the same name `filterValid`, but from Java it will be `filterValid` and `filterValidInt`.

The same trick applies when we need to have a property `x` alongside with a function `getX()`:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```
</div>

To change the names of generated accessor methods for properties without explicitly implemented getters and setters, you can use `@get:JvmName` and `@set:JvmName`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```
</div>

## Overloads generation

Normally, if you write a Kotlin function with default parameter values, it will be visible in Java only as a full
signature, with all parameters present. If you wish to expose multiple overloads to Java callers, you can use the
[`@JvmOverloads`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html) annotation.

The annotation also works for constructors, static methods, and so on. It can't be used on abstract methods, including methods
defined in interfaces.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```
</div>

For every parameter with a default value, this will generate one additional overload, which has this parameter and
all parameters to the right of it in the parameter list removed. In this example, the following will be
generated:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Constructors:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// Methods
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```
</div>

Note that, as described in [Secondary Constructors](classes.html#secondary-constructors), if a class has default
values for all constructor parameters, a public no-argument constructor will be generated for it. This works even
if the `@JvmOverloads` annotation is not specified.


## Checked exceptions

As we mentioned above, Kotlin does not have checked exceptions.
So, normally, the Java signatures of Kotlin functions do not declare exceptions thrown.
Thus if we have a function in Kotlin like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```
</div>

And we want to call it from Java and catch the exception:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java
try {
  demo.Example.writeToFile();
}
catch (IOException e) { // error: writeToFile() does not declare IOException in the throws list
  // ...
}
```
</div>

we get an error message from the Java compiler, because `writeToFile()` does not declare `IOException`.
To work around this problem, use the [`@Throws`](/api/latest/jvm/stdlib/kotlin.jvm/-throws/index.html) annotation in Kotlin:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```
</div>

## Null-safety

When calling Kotlin functions from Java, nobody prevents us from passing *null*{: .keyword } as a non-null parameter.
That's why Kotlin generates runtime checks for all public functions that expect non-nulls.
This way we get a `NullPointerException` in the Java code immediately.

## Variant generics

When Kotlin classes make use of [declaration-site variance](generics.html#declaration-site-variance), there are two 
options of how their usages are seen from the Java code. Let's say we have the following class and two functions that use it:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```
</div>

A naive way of translating these functions into Java would be this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```
</div>

The problem is that in Kotlin we can say `unboxBase(boxDerived("s"))`, but in Java that would be impossible, because in Java 
  the class `Box` is *invariant* in its parameter `T`, and thus `Box<Derived>` is not a subtype of `Box<Base>`. 
  To make it work in Java we'd have to define `unboxBase` as follows:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
Base unboxBase(Box<? extends Base> box) { ... }  
```
</div>

Here we make use of Java's *wildcards types* (`? extends Base`) to emulate declaration-site variance through use-site 
variance, because it is all Java has.

To make Kotlin APIs work in Java we generate `Box<Super>` as `Box<? extends Super>` for covariantly defined `Box` 
(or `Foo<? super Bar>` for contravariantly defined `Foo`) when it appears *as a parameter*. When it's a return value,
we don't generate wildcards, because otherwise Java clients will have to deal with them (and it's against the common 
Java coding style). Therefore, the functions from our example are actually translated as follows:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// return type - no wildcards
Box<Derived> boxDerived(Derived value) { ... }
 
// parameter - wildcards 
Base unboxBase(Box<? extends Base> box) { ... }
```
</div>

> When the argument type is final, there's usually no point in generating the wildcard, so `Box<String>` is always `Box<String>`, no matter what position it takes.
{:.note}

If we need wildcards where they are not generated by default, we can use the `@JvmWildcard` annotation:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// is translated to 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```
</div>

On the other hand, if we don't need wildcards where they are generated, we can use `@JvmSuppressWildcards`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// is translated to 
// Base unboxBase(Box<Base> box) { ... }
```
</div>

>`@JvmSuppressWildcards` can be used not only on individual type arguments, but on entire declarations, such as functions or classes, causing all wildcards inside them to be suppressed.
{:.note}

### Translation of type `Nothing`
 
The type [`Nothing`](exceptions.html#the-nothing-type) is special, because it has no natural counterpart in Java. Indeed, every Java reference type, including
`java.lang.Void`, accepts `null` as a value, and `Nothing` doesn't accept even that. So, this type cannot be accurately
represented in the Java world. This is why Kotlin generates a raw type where an argument of type `Nothing` is used:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun emptyList(): List<Nothing> = listOf()
// is translated to
// List emptyList() { ... }
```
</div>
