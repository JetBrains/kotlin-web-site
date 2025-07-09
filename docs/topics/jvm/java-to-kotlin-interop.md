[//]: # (title: Calling Kotlin from Java)

Kotlin code can be easily called from Java.
For example, instances of a Kotlin class can be seamlessly created and operated in Java methods.
However, there are certain differences between Java and Kotlin that require attention when
integrating Kotlin code into Java. 
On this page, we'll describe the ways to tailor the interop of your Kotlin code with its Java clients.

## Properties

A Kotlin property is compiled to the following Java elements:

 * a getter method, with the name calculated by prepending the `get` prefix.
 * a setter method, with the name calculated by prepending the `set` prefix (only for `var` properties).
 * a private field, with the same name as the property name (only for properties with backing fields).

For example, `var firstName: String` compiles to the following Java declarations:

```java
private String firstName;

public String getFirstName() {
    return firstName;
}

public void setFirstName(String firstName) {
    this.firstName = firstName;
}
```

If the name of the property starts with `is`, a different name mapping rule is used: the name of the getter is
the same as the property name, and the name of the setter is obtained by replacing `is` with `set`.
For example, for a property `isOpen`, the getter is called `isOpen()` and the setter is called `setOpen()`.
This rule applies for properties of any type, not just `Boolean`.

## Package-level functions

All the functions and properties declared in a file `app.kt` inside a package `org.example`, including extension functions,
are compiled into static methods of a Java class named `org.example.AppKt`.

```kotlin
// app.kt
package org.example

class Util

fun getTime() { /*...*/ }

```

```java
// Java
new org.example.Util();
org.example.AppKt.getTime();
```

To set a custom name to the generated Java class, use the `@JvmName` annotation:

```kotlin
@file:JvmName("DemoUtils")

package org.example

class Util

fun getTime() { /*...*/ }

```

```java
// Java
new org.example.Util();
org.example.DemoUtils.getTime();
```

Having multiple files with the same generated Java class name (the same package and the same name or the same
[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) annotation) is normally an error.
However, the compiler can generate a single Java facade class which has the specified name and contains
all the declarations from all the files which have that name.
To enable the generation of such a facade, use the [`@JvmMultifileClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html)
annotation in all such files.

```kotlin
// oldutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getTime() { /*...*/ }
```

```kotlin
// newutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getDate() { /*...*/ }
```

```java
// Java
org.example.Utils.getTime();
org.example.Utils.getDate();
```

## Instance fields

If you need to expose a Kotlin property as a field in Java, annotate it with the [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) annotation.
The field has the same visibility as the underlying property. You can annotate a property with `@JvmField` if it:
* has a backing field
* is not private
* does not have `open`, `override` or `const` modifiers
* is not a delegated property

```kotlin
class User(id: String) {
    @JvmField val ID = id
}
```

```java

// Java
class JavaClient {
    public String getID(User user) {
        return user.ID;
    }
}
```

[Late-Initialized](properties.md#late-initialized-properties-and-variables) properties are also exposed as fields. 
The visibility of the field is the same as the visibility of the `lateinit` property setter.

## Static fields

Kotlin properties declared in a named object or a companion object have static backing fields
either in that named object or in the class containing the companion object.

Usually these fields are private, but they can be exposed in one of the following ways:

 - [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) annotation
 - `lateinit` modifier
 - `const` modifier
 
Annotating such a property with `@JvmField` makes it a static field with the same visibility as the property itself.

```kotlin
class Key(val value: Int) {
    companion object {
        @JvmField
        val COMPARATOR: Comparator<Key> = compareBy<Key> { it.value }
    }
}
```

```java
// Java
Key.COMPARATOR.compare(key1, key2);
// public static final field in Key class
```

A [late-initialized](properties.md#late-initialized-properties-and-variables) property in an object or a companion object
has a static backing field with the same visibility as the property setter.

```kotlin
object Singleton {
    lateinit var provider: Provider
}
```

```java

// Java
Singleton.provider = new Provider();
// public static non-final field in Singleton class
```

Properties declared as `const` (in classes as well as at the top level) are turned into static fields in Java:

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

In Java:

```java

int constant = Obj.CONST;
int max = ExampleKt.MAX;
int version = C.VERSION;
```

## Static methods

As mentioned above, Kotlin represents package-level functions as static methods.
Kotlin can also generate static methods for functions defined in named objects or companion objects if you annotate those
functions as [`@JvmStatic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/index.html).
If you use this annotation, the compiler generates both a static method in the enclosing class of the object and
an instance method in the object itself. For example:

```kotlin
class C {
    companion object {
        @JvmStatic fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

Now, `callStatic()` is static in Java while `callNonStatic()` is not:

```java

C.callStatic(); // works fine
C.callNonStatic(); // error: not a static method
C.Companion.callStatic(); // instance method remains
C.Companion.callNonStatic(); // the only way it works
```

Similarly, for named objects:

```kotlin
object Obj {
    @JvmStatic fun callStatic() {}
    fun callNonStatic() {}
}
```

In Java:

```java

Obj.callStatic(); // works fine
Obj.callNonStatic(); // error
Obj.INSTANCE.callNonStatic(); // works, a call through the singleton instance
Obj.INSTANCE.callStatic(); // works too
```

Starting from Kotlin 1.3, `@JvmStatic` applies to functions defined in companion objects of interfaces as well.
Such functions compile to static methods in interfaces. Note that static method in interfaces were introduced in Java 1.8,
so be sure to use the corresponding targets.  

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```

You can also apply `@JvmStatic` annotation to the property of an object or a companion object making its getter and setter
methods static members in that object or the class containing the companion object.

## Default methods in interfaces

When targeting the JVM, Kotlin compiles functions declared in interfaces to [default methods](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html) unless [configured otherwise](#compatibility-modes-for-default-methods).
These are concrete methods in interfaces that Java classes can inherit directly, without reimplementation.

Here is an example of a Kotlin interface with a default method:

```kotlin
interface Robot {
    fun move() { println("~walking~") }  // will be default in the Java interface
    fun speak(): Unit
}
```

The default implementation is available for Java classes implementing the interface.

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

```java
C3PO c3po = new C3PO();
c3po.move(); // default implementation from the Robot interface
c3po.speak();
```

Implementations of the interface can override default methods.

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

### Compatibility modes for default methods

Kotlin provides three modes for controlling how functions in interfaces are compiled to JVM default methods.
These modes determine whether the compiler generates compatibility bridges and static methods in `DefaultImpls` classes.

You can control this behavior using the `-jvm-default` compiler option:

> The `-jvm-default` compiler option replaces the deprecated `-Xjvm-default` option.
>
{style="note"}

Learn more about compatibility modes:

#### enable {initial-collapse-state="collapsed" collapsible="true"}

Default behavior.
Generates default implementations in interfaces and includes compatibility bridges and `DefaultImpls` classes.
This mode maintains compatibility with older compiled Kotlin code.

#### no-compatibility {initial-collapse-state="collapsed" collapsible="true"}

Generates only default implementations in interfaces.
Skips compatibility bridges and `DefaultImpls` classes.
Use this mode for new codebases that don't interact with code that relies on `DefaultImpls` classes.
This can break binary compatibility with older Kotlin code.

> If interface delegation is used, all interface methods are delegated.
>
{style="note"}

#### disable {initial-collapse-state="collapsed" collapsible="true"}

Disables default implementations in interfaces.
Only compatibility bridges and `DefaultImpls` classes are generated.

## Visibility

The Kotlin visibility modifiers map to Java in the following way:

* `private` members are compiled to `private` members.
* `private` top-level declarations are compiled to `private` top-level declarations. Package-private accessors are also included,
if accessed from within a class. 
* `protected` remains `protected`. (Note that Java allows accessing protected members from other classes in the same package
and Kotlin doesn't, so Java classes will have broader access to the code.)
* `internal` declarations become `public` in Java. Members of `internal` classes go through name mangling, to make.
it harder to accidentally use them from Java and to allow overloading for members with the same signature that don't see
each other according to Kotlin rules.
* `public` remains `public`.

## KClass

Sometimes you need to call a Kotlin method with a parameter of type `KClass`.
There is no automatic conversion from `Class` to `KClass`, so you have to do it manually by invoking the equivalent of
the `Class<T>.kotlin` extension property:

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```

## Handling signature clashes with @JvmName

Sometimes we have a named function in Kotlin, for which we need a different JVM name in bytecode.
The most prominent example happens due to *type erasure*:

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

These two functions can not be defined side-by-side, because their JVM signatures are the same: `filterValid(Ljava/util/List;)Ljava/util/List;`.
If we really want them to have the same name in Kotlin, we can annotate one (or both) of them with
[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) and specify a different name
as an argument:

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

From Kotlin, they are accessible by the same name `filterValid`, but from Java it is `filterValid` and `filterValidInt`.

The same trick applies when we need to have a property `x` along with a function `getX()`:

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```

To change the names of generated accessor methods for properties without explicitly implemented getters and setters,
you can use `@get:JvmName` and `@set:JvmName`:

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```

## Overloads generation

Normally, if you write a Kotlin function with default parameter values, it is visible in Java only as a full
signature, with all parameters present. If you wish to expose multiple overloads to Java callers, you can use the
[`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html) annotation.

The annotation also works for constructors, static methods, and so on. It can't be used on abstract methods, including
methods defined in interfaces.

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```

For every parameter with a default value, this generates one additional overload, which has this parameter and
all parameters to the right of it in the parameter list removed. In this example, the following is generated:

```java
// Constructors:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// Methods
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```

Note that, as described in [Secondary constructors](classes.md#secondary-constructors), if a class has default
values for all constructor parameters, a public constructor with no arguments is generated for it. This works even
if the `@JvmOverloads` annotation is not specified.

## Checked exceptions

Kotlin does not have checked exceptions.
So, normally the Java signatures of Kotlin functions do not declare exceptions thrown.
Thus, if you have a function in Kotlin like this:

```kotlin
// example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```

And you want to call it from Java and catch the exception:

```java

// Java
try {
    demo.Example.writeToFile();
} catch (IOException e) { 
    // error: writeToFile() does not declare IOException in the throws list
    // ...
}
```

You get an error message from the Java compiler, because `writeToFile()` does not declare `IOException`.
To work around this problem, use the [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/index.html)
annotation in Kotlin:

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```

## Null-safety

When calling Kotlin functions from Java, nobody prevents us from passing `null` as a non-nullable parameter.
That's why Kotlin generates runtime checks for all public functions that expect non-nulls.
This way we get a `NullPointerException` in the Java code immediately.

## Variant generics

When Kotlin classes make use of [declaration-site variance](generics.md#declaration-site-variance), there are two 
options of how their usages are seen from the Java code. For example, imagine you have the following class and two functions that use it:

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

A naive way of translating these functions into Java would be this:

```java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```

The problem is that in Kotlin you can write `unboxBase(boxDerived(Derived()))` but in Java that would be impossible
because in Java the class `Box` is *invariant* in its parameter `T`, and thus `Box<Derived>` is not a subtype of `Box<Base>`. 
To make this work in Java, you would have to define `unboxBase` as follows:

```java
Base unboxBase(Box<? extends Base> box) { ... }  
```

This declaration uses Java's *wildcards types* (`? extends Base`) to emulate declaration-site variance through use-site 
variance, because it is all Java has.

To make Kotlin APIs work in Java, the compiler generates `Box<Super>` as `Box<? extends Super>` for covariantly defined `Box` 
(or `Foo<? super Bar>` for contravariantly defined `Foo`) when it appears *as a parameter*. When it's a return value,
wildcards are not generated, because otherwise Java clients will have to deal with them (and it's against the common 
Java coding style). Therefore, the functions from our example are actually translated as follows:

```java

// return type - no wildcards
Box<Derived> boxDerived(Derived value) { ... }
 
// parameter - wildcards 
Base unboxBase(Box<? extends Base> box) { ... }
```

> When the argument type is final, there's usually no point in generating the wildcard, so `Box<String>` is always `Box<String>`,
>no matter what position it takes.
>
{style="note"}

If you need wildcards where they are not generated by default, use the `@JvmWildcard` annotation:

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// is translated to 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

In the opposite case, if you don't need wildcards where they are generated, use `@JvmSuppressWildcards`:

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// is translated to 
// Base unboxBase(Box<Base> box) { ... }
```

>`@JvmSuppressWildcards` can be used not only on individual type arguments, but on entire declarations, such as functions
>or classes, causing all wildcards inside them to be suppressed.
>
{style="note"}

### Translation of type Nothing
 
The type [`Nothing`](exceptions.md#the-nothing-type) is special, because it has no natural counterpart in Java. Indeed, every Java reference type, including
`java.lang.Void`, accepts `null` as a value, and `Nothing` doesn't accept even that. So, this type cannot be accurately
represented in the Java world. This is why Kotlin generates a raw type where an argument of type `Nothing` is used:

```kotlin
fun emptyList(): List<Nothing> = listOf()
// is translated to
// List emptyList() { ... }
```

### Inline value classes

<primary-label ref="experimental-general"/>

If you want Java code to work smoothly with Kotlin's [inline value classes](inline-classes.md), you can use the
[`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/) annotation or the `-Xjvm-expose-boxed` compiler option. These approaches ensure Kotlin generates the 
necessary boxed representations for Java interoperability.

By default, Kotlin compiles inline value classes to use **unboxed representations**, which are often inaccessible from Java.
For example, you can't call the constructor for the `MyInt` class from Java:

```kotlin
@JvmInline
value class MyInt(val value: Int)
```

So the following Java code fails:

```java
MyInt input = new MyInt(5);
```

You can use the `@JvmExposeBoxed` annotation so that Kotlin generates a public constructor that you can call from Java directly.
You can apply the annotation at the following levels to ensure fine-grained control over what's exposed to Java:

* Class
* Constructor
* Function

Before using the `@JvmExposeBoxed` annotation in your code, you must opt in by using `@OptIn(ExperimentalStdlibApi::class)`.
For example:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

With these annotations, Kotlin generates a Java-accessible constructor for the `MyInt` class **and** a variant for the 
extension function that uses the boxed form of the value class. So the following Java code runs successfully:

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

To apply this behavior to all inline value classes and the functions that use them within a module, compile it with the `-Xjvm-expose-boxed` option. 
Compiling with this option has the same effect as if every declaration in the module has the `@JvmExposeBoxed` annotation.

> The `@JvmExposeBoxed` annotation doesn't automatically generate boxed representations for inherited functions.
> 
> To generate the necessary representation for an inherited function, override it in the implementing or extending class:
> 
> ```kotlin
> interface Test {
>     fun test(p: UInt): UInt = p
> }
>
> // Doesn't generate a boxed representation for the test() function
> @OptIn(ExperimentalStdlibApi::class)
> @JvmExposeBoxed
> class TestClass : Test
> 
> // Generates a boxed representation for the test() function
> @OptIn(ExperimentalStdlibApi::class)
> @JvmExposeBoxed
> class TestClass : Test {
>     override fun test(p: UInt): UInt = super.test(p)
> }
> ```
> 
{style="note"}