[//]: # (title: Reflection)
[//]: # (description: Learn how to use Kotlin reflection to inspect classes, types, properties, and functions at runtime.)

_Reflection_ is a set of language and library features that allows you to introspect the structure of your program at runtime.
For example, you can inspect declarations, access properties, or create objects. This is helpful when you don't know
the declarations at compile time.

Reflection provides runtime objects that describe compiled declarations. For example, a class is represented by [`KClass`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/),
a type by [`KType`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-type/), and a property or function by a subtype of [`KCallable`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-callable/).
You can inspect these objects and use them to access a value or invoke a function.

## How reflection works

The [reflection API](https://kotlinlang.org/api/core/kotlin-reflect/) represents compiled declarations through Kotlin types such as `KClass` or `KFunction`.
A reflection object describes this declaration, but it isn't the declaration's value. For example, you can use a `KProperty`
to get a property's name and return its type without reading that property from an object.

Kotlin provides some basic features, such as class literals or callable references, as part of the language and standard
library. To access more extensive runtime introspection, import the [`kotlin-reflect`](https://kotlinlang.org/api/core/kotlin-reflect/) library
that consists of the following packages:

* [`kotlin.reflect`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/) with core reflection types and functions.
* [`kotlin.reflect.full`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/) with extensions for inspecting Kotlin declarations.
* [`kotlin.reflect.jvm`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.jvm/) with JVM-specific extensions that connect Kotlin and Java reflections.

> Reflection support may differ between platforms. This page aligns with Kotlin/JVM reflection API. Learn more about [reflection
> in Kotlin/JS](js-reflection.md).
> 
{style="note"}

## Add the JVM dependency

On the JVM platform, the Kotlin compiler distribution includes the runtime component required for using the reflection
features as a separate artifact, `kotlin-reflect.jar`. This allows applications without reflection features to reduce the
size of the runtime classpath.

To use reflection in a Gradle or Maven project, add the dependency on `kotlin-reflect`:

<tabs group="build-script">
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
    </dependency>
</dependencies>
```

</tab>
</tabs>

If you don't use Gradle or Maven, make sure you have `kotlin-reflect.jar` in the classpath of your project.
In other supported cases (IntelliJ IDEA projects that use the command-line compiler),
it is added by default. In the command-line compiler, you can use the `-no-reflect` compiler option to exclude
`kotlin-reflect.jar` from the classpath.

## Obtain a runtime class

Most reflection operations begin with a `KClass`. How you obtain it depends on whether the class is known at compile time:

* Use `ClassName::class` to reference a class known at compile time.
* Use `value::class` to obtain the actual class of a runtime value, which may be more specific than its declared type.

```kotlin
class User(val name: String)

open class Language
class Kotlin : Language()

fun main() {
    // The class written before ::class
    val userClass = User::class
    println(userClass.simpleName)
    // User

    val language: Language = Kotlin()

    // The actual class of the object
    println(language::class.simpleName)
    // Kotlin
}
```
{kotlin-runnable="true"}

The obtained reference is a [`KClass`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/) type value.

### Inspect types

Even though [`KClass`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/) represents a class, it doesn't preserve type arguments.
For example, `List<Int>` has the same `List::class` representation as `List<String>`.
To return a [`KType`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-type/) that includes type arguments and nullability, use the [`typeOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/type-of.html) function:

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

In this example, the `classifier` connects the type to its class or type parameter. The `arguments` collection contains
its type arguments. Therefore, the code can inspect `String?` separately from `List`.

> On the JVM, the created type has no annotations, even when you annotate the type in the source code. Support for type
> annotations might be added in a future version.
>
{style="note"}

### Check values

The `is`, `as`, and `as?` operators work when you write the target type directly in the code. However, if you store the target in
a `KClass`, use:

* The [`isInstance()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/is-instance.html) function to check if a value is an instance of the class.
* The [`cast()`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/cast.html) function if a mismatch should stop the operation.
* The [`safeCast()`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/safe-cast.html) function if mismatch is an expected possibility.

```kotlin
import kotlin.reflect.full.cast
import kotlin.reflect.full.safeCast

fun main() {
    val expectedClass = String::class
    val value: Any = "Kotlin"
    
    println(expectedClass.isInstance(value))
    // true
    println(expectedClass.isInstance(22))
    // false
    
    val text = expectedClass.cast(value)
    println(text)
    // Kotlin
    
    val number = Int::class.safeCast(value)
    println(number)
    // null
}
```

## Inspect a class

After obtaining a `KClass`, you can inspect its members. This way, your program learns which declarations exist before
deciding whether to use any of them. Use the [`members`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/members.html) to inspect functions and properties. It returns a collection
of `KCallable` objects with all declarations accessible in the class, including inherited declarations. 

For example, the following code lists the functions and properties accessible in a data class:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    println(User::class.members.map { it.name }.sorted())
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
| [`declaredMemberExtensionProperties`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/declared-member-extension-properties.html) | Extension properties declared as members in the                                                                                              |
| [`staticProperties`](https://kotlinlang.org/api/core/kotlin-reflect/kotlin.reflect.full/static-properties.html)                                     | Properties representing static fields declared in Java classes                                                                               |

Choose the narrowest property that matches the declarations your code needs. For example, a serializer might use
`declaredMemberProperties` to process only properties introduced by a specific class, while a framework that searches
for a callable API might need inherited `memberFunctions` as well.

You can also [inspect sealed subclasses](sealed-classes.md#inspect-sealed-subclasses-with-reflection) with reflection.

## Read a property

Reflection allows you to read a property selected at runtime.
For example, you have a UI configuration that contains `name` and asks the application to display that property for a `User`.
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

> If the property is known at compile time, use normal access or callable references.
> 
{style="tip"}

## Call functions

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

You can also associate values with `KParameter` objects instead of supplying them by position. For that, use the [`callBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-callable/call-by.html) to.
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