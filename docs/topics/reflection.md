[//]: # (title: Reflection)
[//]: # (description: Learn how to use Kotlin reflection to inspect classes, types, properties, and functions at runtime.)

_Reflection_ is a set of language and library features that allows you to introspect the structure of your program at runtime.
For example, you can read or update a property, call a function, or invoke a class constructor to create an instance. This
is helpful when you don't know the declarations at compile time.

Reflection provides runtime objects that describe compiled declarations. For example, a class is represented by [`KClass`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/),
a type by [`KType`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-type/), and a property or function by a subtype of [`KCallable`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-callable/).
You can inspect these objects and use them to access a value or invoke a function.

## How reflection works

The [reflection API](https://kotlinlang.org/api/core/kotlin-reflect/) represents compiled declarations through Kotlin types such as `KClass` or `KFunction`.
A reflection object represents the declaration itself, not the result of using it. For example, you can use a `KProperty`
to get a property's name and return its type without reading that property from an object.

Kotlin provides some basic features, such as class literals or callable references, as part of the language and standard
library. To access more extensive runtime introspection, import the [`kotlin-reflect`](https://kotlinlang.org/api/core/kotlin-reflect/) library.

The reflection APIs consist of the following packages:

* [`kotlin.reflect`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/) is part of the standard library and contains core reflection types and functions.
* [`kotlin.reflect.full`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/) with extensions for inspecting Kotlin declarations.
* [`kotlin.reflect.jvm`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.jvm/) with JVM-specific extensions that connect Kotlin and Java reflections.

> Reflection support may differ between platforms. This page aligns with Kotlin/JVM reflection API. Learn more about [reflection
> in Kotlin/JS](js-reflection.md).
> 
{style="note"}

## Obtain a runtime class

Most reflection operations begin with a [`KClass`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/). How you obtain it depends on whether the class is known at compile time:

* Use `ClassName::class` to reference a class known at compile time.
* Use `value::class` to obtain the actual class of a runtime value, which may be more specific than its declared type.

```kotlin
import kotlin.reflect.KClass

class User(val name: String)

open class Language
class Kotlin : Language()

fun main() {
    // Returns a KClass that represents User.
    val userClass: KClass<User> = User::class
    println(userClass.simpleName)
    // User
    
    val language: Language = Kotlin()

    // Returns a KClass that represents
    // the concrete class of the value at runtime
    val runtimeClass: KClass<out Language> = language::class
    println(runtimeClass.simpleName)
    // Kotlin
}
```
{kotlin-runnable="true"}

> The Kotlin standard library provides basic tools for inspecting classes. For more extensive runtime introspection, add 
> the `kotlin-reflect` dependency and use its APIs.
> 
{style="note"}

## Add the JVM dependency

On the JVM platform, the Kotlin compiler distribution includes the runtime component required for using the reflection
features as a separate artifact, `kotlin-reflect.jar`. This allows applications without reflection features to exclude this
artifact and reduce the size of the runtime classpath.

To use reflection in a Gradle or Maven project, add the dependency on `kotlin-reflect`:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
dependencies {
    implementation(kotlin("reflect"))
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-reflect</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

</tab>
</tabs>

If you don't use Gradle or Maven, make sure you have `kotlin-reflect.jar` in the classpath of your project. The command-line
compiler adds the library by default. To exclude it from the classpath, use the `-no-reflect` [compiler option](compiler-reference.md#compiler-options).

## Inspect types

`KClass` and `KType` represent different information. A `KClass` represents a class without preserving type arguments or
nullability. For example, `List<String>` and `List<Int>` share the same `List::class` representation, and `String` and
`String?` share `String::class`. Therefore, use the [`typeOf<T>()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/type-of.html) function to obtain a `KType` for the statically
known type `T`, including its type arguments and nullability.

In the following example, the `classifier` property connects the type to its class or type parameter. The `arguments`
collection contains its type arguments. Therefore, the code can inspect `String?` separately from `List`:

```kotlin
import kotlin.reflect.typeOf

fun main() {
    val type = typeOf<List<String?>>()

    println(type.classifier)
    // class kotlin.collections.List
    println(type.arguments.single().type)
    // kotlin.String?
}
```

> On the JVM, the created type has no annotations, even when you annotate the type in the source code. Support for type
> annotations might be added in a future version of the `kotlin-reflect` library.
>
{style="note"}

## Check values

The [`is`, `as`, and `as?` operators](typecasts.md) work when you write the target type directly in the code. However, if you store the target class in a `KClass`, use:

* The [`isInstance()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/is-instance.html) function, to check if a value is an instance of the class. It returns `true` or `false`.
* The [`cast()`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/cast.html) function, to return the value with the target type. It throws an exception if the value is `null` or has an incompatible type.
* The [`safeCast()`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/safe-cast.html) function, to return the value with the target type, or `null` if the value is `null` or has an incompatible type.

```kotlin
import kotlin.reflect.cast
import kotlin.reflect.safeCast

fun main() {
    val expectedClass = String::class
    val value: Any = "Kotlin"

    // Checks the value without casting it
    println(expectedClass.isInstance(value))
    // true

    // Return the value as a String
    val text = expectedClass.cast(value)
    println(text.length)
    // 6

    // An incompatible cast throws an exception
    val failedCast = runCatching {
        Int::class.cast(value)
    }
    println(failedCast.isFailure)
    // true

    // A safe cast represents the same mismatch with null
    val number = Int::class.safeCast(value)
    println(number)
    // null
}
```
{kotlin-runnable="true"}

## Inspect a class

After obtaining a `KClass`, you can inspect its members. This way, you learn which declarations exist before using them.
Use the [`members`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/members.html) property to inspect functions and properties of a class. It contains a collection of `KCallable` objects with all declarations accessible in the class, including inherited declarations. 

For example, the following code lists the functions and properties accessible in a data class:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    println(User::class.members.map { it.name }.sorted())
    // [age, component1, component2, copy, equals, hashCode, name, toString]
}
```

The `kotlin.reflect.full` package provides more specific properties for selecting declarations by kind, scope, and receiver:

| Property                                                                                                                                            | Returns                                                                                                                                      |
|-----------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| [`declaredMembers`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/declared-members.html)                                       | Functions and properties declared directly in the class, excluding inherited declarations                                                    |
| [`functions`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/functions.html)                                                    | All functions available from the class: non-static functions from the class and its superclasses, and static functions declared in the class |
| [`declaredFunctions`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/declared-functions.html)                                   | All functions declared in the class                                                                                                          |
| [`memberFunctions`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/member-functions.html)                                       | Non-extension, non-static functions declared in the class and its superclasses                                                               |
| [`declaredMemberFunctions`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/declared-member-functions.html)                      | Non-extension, non-static functions declared in the class                                                                                    |
| [`memberExtensionFunctions`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/member-extension-functions.html)                    | Extension functions declared as members of the class or its superclasses                                                                     |
| [`declaredMemberExtensionFunctions`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/declared-member-extension-functions.html)   | Extension functions declared in the class                                                                                                    |
| [`staticFunctions`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/static-functions.html)                                       | Static functions declared in the class                                                                                                       |
| [`memberProperties`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/member-properties.html)                                     | Non-extension properties declared in the class and its superclasses                                                                          |
| [`declaredMemberProperties`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/declared-member-properties.html)                    | Non-extension properties declared in the class                                                                                               |
| [`memberExtensionProperties`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/member-extension-properties.html)                  | Extension properties declared as members of the class or its superclasses                                                                    |
| [`declaredMemberExtensionProperties`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/declared-member-extension-properties.html) | Extension properties declared as members in the class.                                                                                       |
| [`staticProperties`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/static-properties.html)                                     | Properties representing static fields declared in Java classes                                                                               |

Choose the narrowest property that matches the declarations your code needs. For example, a serializer might use
`declaredMemberProperties` to process only properties introduced by a specific class, while a framework that searches
for a callable API might need inherited `memberFunctions` as well.

You can also [inspect sealed subclasses](sealed-classes.md#inspect-sealed-subclasses-with-reflection) with reflection.

## Read a property

Reflection allows you to read a property selected at runtime.
For example, you have a UI configuration specifies `name` as the property to display from a `User` object.
For that, the application must find the matching property declaration and then invoke its getter:

```kotlin
import kotlin.reflect.full.memberProperties

data class User(val name: String, val age: Int)

fun readProperty(instance: Any, propertyName: String): Any? {
    // Inspect the runtime class
    val runtimeClass = instance::class

    // Find the property declaration
    val property = runtimeClass.memberProperties
        .firstOrNull { it.name == propertyName }
        ?: error("Unknown property: $propertyName")

    // Call the getter with the object as a receiver
    return property.getter.call(instance)
}

fun main() {
    val user = User("Jane Doe", 22)

    println(readProperty(user, "name"))
    // Jane Doe
    println(readProperty(user, "age"))
    // 22
}
```

This example uses [`memberProperties`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/member-properties.html) to return unbound property objects. These objects describe properties
that belong to the class but aren't attached to a particular instance. Therefore, `getter.call()` needs `instance` as its
receiver. The result has the `Any?` type because a property selected at runtime can return any type.

> If the property is known at compile time, use direct property access or a [callable reference](lambdas.md#callable-reference), instead of reflections.
> 
{style="tip"}

## Call a function

Dynamic function calls follow the same pattern as [properties](#read-a-property). If all arguments are available in their declared order, you
can use [`call()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-callable/call.html). Declare an unbound member function with its object instance first, then add its regular arguments:

```kotlin
import kotlin.reflect.full.memberFunctions

class Formatter {
    fun format(text: String, uppercase: Boolean): String =
        if (uppercase) text.uppercase() else text
}

fun main() {
    val formatter = Formatter()

    // Find the function by its name at runtime
    val function = Formatter::class.memberFunctions
        .single { it.name == "format" }

    // Supply the receiver first, then the declared arguments in order
    val result = function.call(formatter, "Kotlin", true)

    println(result)
    // KOTLIN
}
```

In this example, the call contains three values: the `Formatter` receiver, `text`, and `uppercase`. It also returns the `Any?` type
and reports an incompatible receiver or argument at runtime.

You can also associate values with `KParameter` objects instead of supplying them by position. For that, use the [`callBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-callable/call-by.html).
function:

```kotlin
import kotlin.reflect.full.instanceParameter
import kotlin.reflect.full.memberFunctions
import kotlin.reflect.full.valueParameters

class Greeter {
    fun greet(name: String, punctuation: String = "!") =
        "Hello, $name$punctuation"
}

fun main() {
    val greeter = Greeter()
    val function = Greeter::class.memberFunctions
        .single { it.name == "greet" }

    // valueParameters contains parameters declared in greet()
    // but not the Greeter receiver
    val nameParameter = function.valueParameters
        .single { it.name == "name" }

    val result = function.callBy(
        mapOf(
            // Member functions need an instance receiver
            function.instanceParameter!! to greeter,
            nameParameter to "Kotlin"
        )
    )

    println(result)
    // Hello, Kotlin!
}
```

In this example, `instanceParameter` identifies the member-function receiver, and `valueParameters` contains only parameters declared in the function signature.

> Use `call()` when the complete ordered argument list is already available.
> 
> Use `callBy()` when you match arguments to parameter objects or let optional parameters use their defaults.
> 
{style="tip"}