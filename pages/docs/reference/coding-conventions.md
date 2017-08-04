---
type: doc
layout: reference
category: Basics
title: Coding Conventions
---

# Coding Conventions

This page contains the current coding style for the Kotlin language.

## Source code organization

### Directory structure

In mixed-language projects, Kotlin source files should reside in the same source root as the Java source files,
and follow the same directory structure (each file should be stored in the directory corresponding to each package
statement).

In pure Kotlin projects, the recommended directory structure is to follow the package structure with
the common root package omitted (e.g. if all the code in the project is in the "org.example.kotlin" package and its
subpackages, files with the "org.example.kotlin" package should be placed directly under the source root, and
files in "org.example.kotlin.foo.bar" should be in the "foo/bar" subdirectory of the source root.

### Source file organization

Placing multiple declarations (classes, top-level functions or properties) in the same Kotlin source file is encouraged
as long as these declarations are closely related to each other semantically.

### Source file names

If a Kotlin file contains a single class (potentially with related top-level declarations), its name should be the same
as the name of the class, with the .kt extension appended. If a file contains multiple classes, or only top-level declarations,
choose a name describing what the file contains, and name the file accordingly. Use camel humps with an uppercase first letter
(e.g. `ProcessDeclarations.kt`).

The name of the file should describe what the code in the file does. Therefore, you should avoid using meaningless
words such as "Util" in file names.

## Naming rules

Kotlin follows the Java naming conventions. In particular:

 * Names of packages are always lower case and do not use underscores (`org.example.myproject`). Using multi-word
   names is generally discouraged, but if you do need to use multiple words, you can either simply concatenate them together
   or use camel humps (`org.example.myProject`).
 * Names of classes start with an upper case letter and use camel humps (`class DeclarationProcessor`)
 * Names of functions and properties start with a lower case letter and use camel humps and no underscores 
   (`fun processDeclarations()`, `val declarationCount`)
 * Names of constants should use uppercase underscore-separated names (`const val MAX_COUNT = 8`) 
 * For enum constants, it's OK to use either uppercase underscore-separated names
   (`enum class Color { RED, GREEN }`) or regular camel-humps names starting with an uppercase letter, depending on the usage.
   
When using an acronym as part of a declaration name, capitalize it if it consists of two letters (`IOStream`);
capitalize only the first letter if it is longer (`HttpInputStream`).  

### Choosing good names

The name of a class is usually a noun or a noun phrase explaining what the class _is_: `List`, `PersonReader`.

The name of a method is usually a verb or a verb phrase saying what the method _does_: `close`, `readPersons`.

The names should make it clear what the purpose of the entity is, so it's best to avoid using meaningless words
(`Manager`, `Wrapper` etc.) in names.

### Names for backing properties

If a class has two properties which are conceptually the same but one is part of a public API and another is an implementation
detail, use an underscore as the prefix for the name of the private property:

``` kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### Names for test methods

In tests (and only in tests), it's acceptable to use method names with spaces enclosed in backticks.
(Note that such method names are currently not supported by the Android runtime.)

``` kotlin
class MyTestCase {
     @Test fun `ensure everything works`() {
     }
}
```

## General formatting rules

In most cases, Kotlin follows the Java coding conventions.

Use 4 spaces for indentation. Do not use tabs.

Use K&R braces style: put the opening brace in the end of the line where the construct begins, and the closing brace
on a separate line aligned vertically with the opening construct.

``` kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

(Note: In Kotlin, semicolons are optional, and therefore line breaks are significant. The language design assumes 
K&R braces, and you may encounter surprising behavior if you try to use a different formatting style.)

Omit semicolons whenever possible.
   
## Horizontal whitespace

Put spaces around binary operators (`a + b`). Exception: don't put spaces around the "range to" operator (`0..i`).

Do not put spaces around unary operators (`a++`)

Put spaces between control flow keywords (`if`, `when`, `for` and `while`) and the corresponding opening parenthesis.

Do not put a space before an opening parenthesis in a primary constructor declaration, method declaration or method call.

```kotlin
class A(val x: Int)

fun foo(x: Int) { }

fun bar() {
    foo(1)
}
```

Never put a space after `(`, `[`, or before `]`, `)`.

Put a space after `//`: `// This is a comment`

Do not put spaces around angle brackets used to specify type parameters: `class Map<K, V> { ... }`

Do not put spaces around `::`: `Foo::class`, `String::length`

Do not put a space before `?` used to mark a nullable type: `String?`

### Colon

Put a space before `:` in the following cases:

  * when it's used to separate a type and a supertype;
  * when delegating to a superclass constructor or a different constructor of the same class.
  * after the `object` keyword.
    
Don't put a space before `:` when it separates a declaration and its type.
 
Always put a space after `:`.

``` kotlin
abstract class Foo<out T : Any> : IFoo {
    abstract fun foo(a: Int): T
}

class FooImpl : Foo() {
    constructor(x: String) : this(x) {
        //...
    }
    
    val x = object : IFoo { ... } 
} 
```

## Class header formatting

Classes with a few arguments can be written in a single line:

```kotlin
class Person(id: Int, name: String)
```

Classes with longer headers should be formatted so that each primary constructor argument is in a separate line with indentation.
Also, the closing parenthesis should be on a new line. If we use inheritance, then the superclass constructor call or list of implemented interfaces
should be located on the same line as the parenthesis:

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) {

    // ...
}
```

For multiple interfaces, the superclass constructor call should be located first and then each interface should be located in a different line:

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker {
    
    // ...
}
```

Prefer putting a blank line after the class header to make it clear where the header ends and the class body begins.

Constructor parameters can use either the regular indent or the continuation indent (double the regular indent).

## Class layout

Generally, the contents of a class is sorted in the following order:

- Property declarations and initializer blocks
- Secondary constructors
- Method declarations
- Companion object

Do not sort the method declarations alphabetically or by visibility, and do not separate regular methods
from extension methods. Instead, put related stuff together, so that someone reading the class from top to bottom would
be able to follow the logic of what's happening. Choose an order (either higher-level stuff first, or vice versa)
and stick to it.

Put nested classes next to the code that uses those classes. If the classes are intended to be used externally and aren't
referenced inside the class, put them in the end, after the companion object.

### Interface implementation layout

When implementing an interface, keep the implementing members in the same order as members of the interface (if necessary,
interspersed with additional private methods used for the implementation)

### Overload layout

Always put overloads next to each other in a class.

## Function formatting

If the function signature doesn't fit on a single line, use the following syntax:

``` kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType
): ReturnType {
    // body
}
```

Function parameters can use either the regular indent or the continuation indent (double the regular indent).

Prefer using an expression body for functions with the body consisting of a single expression.

``` kotlin
fun foo(): Int {     // bad
    return 1 
}

fun foo() = 1        // good
```

### Expression body formatting

If the function has an expression body that doesn't fit in the same line as the declaration, put the `=` sign on the first line.
Indent the expression body by 4 spaces.

``` kotlin
fun f(x: String) =
    x.length
```

### Formatting of expressions used as function expression bodies

If the body of a function is an `when` or `object` expression, you may put the closing brace of the expression on the 
same indentation level as where the function closing curly brace would be.

``` kotlin
fun f(x: String) = when (x) {
    "foo" -> ...
    else -> ...
}
```

However, if the function header is long and can't be fit on the same line as function declaration (because the declaration
is too long, the condition is complex, or the object expression needs a complex set of super-types), then the expression
is on a new line and the closing brace of the expression is on the same indentation level as the head of the expression:

``` kotlin
fun f(x: String, y: String) =
    when (x.substring(y.length - 1) {
        "foo" -> ...
        else -> ...
    }
```

### Unit

If a function returns Unit, the return type should be omitted:

``` kotlin
fun foo() { // ": Unit" is omitted here

}
```

### Default parameter values

Prefer declaring functions with default parameter values to declaring overloaded functions.

``` kotlin
// Bad
fun foo() = foo("a")
fun foo(a: String) { ... }

// Good
fun foo(a: String = "a") { ... }
```

## Property formatting

For very simple read-only properties, consider one-line formatting:

```kotlin
val isEmpty: Boolean get() = size == 0
```

For more complex properties, always put `get` and `set` keywords on separate lines:

```kotlin
val foo: String 
    get() { 
        // ...
    }

```

## Type aliases

If you have a functional type or a type with type parameters which is used multiple times in a codebase, prefer defining
a type alias for it:

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) -> Unit
typealias PersonIndex = Map<String, Person>
```

## Annotation formatting

Annotations are typically placed on separate lines, before the declaration to which they are attached, and with the same indentation:

``` kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

Annotations without arguments may be placed on the same line:

``` kotlin
@JsonExclude @JvmField
var x: String
```

A single annotation without arguments may be placed on the same line as the corresponding declaration:

``` kotlin
@Test fun foo() { ... }
```

### File annotations

File annotations are placed after the file comment (if any), before the `package` statement, and are separated from `package` with a blank line (to emphasize the fact that they target the file and not the package).

``` kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

## Lambdas

### Lambda formatting

In lambda expressions, spaces should be used around the curly braces, as well as around the arrow which separates the parameters
from the body. If a call takes a single lambda, it should be passed outside of parentheses whenever possible.

``` kotlin
list.filter { it > 10 }
```

### Lambda parameters

In lambdas which are short and not nested, it's recommended to use the `it` convention instead of declaring the parameter
explicitly. In nested lambdas with parameters, parameters should be always declared explicitly.

When declaring parameter names in a multiline lambda, put the names on the first line, followed by the arrow and the newline:

``` kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```

### Returns in a lambda

Avoid using multiple labeled returns in a lambda. Consider restructuring the lambda so that it will have a single exit point.
If that's not possible or not clear enough, consider converting the lambda into an anonymous function.

Do not use a labeled return for the last statement in a lambda.

## Method call formatting

Use the named argument syntax when a method takes multiple parameters of the same primitive type, or for parameters of `Boolean` type,
unless the meaning of all parameters is absolutely clear from context.

``` kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

Put spaces around the `=` sign separating the argument name and value.

### Argument list wrapping

In long argument lists, put a line break after the opening parenthesis. Group multiple closely related arguments
on the same line.

``` kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

### Chained call wrapping

When wrapping chained calls, put the . character or the `?.` operator on the next line, with a single indent:

```
val anchor = owner
    .firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

The first call in the chain usually should have a line break before it, but it's OK to omit it the code makes more sense that way.

## Using conditional statements

Prefer using the expression form of `try`, `if` and `when`. Examples:

``` kotlin
return if (x) foo() else bar()

return when(x) {
    0 -> "zero"
    else -> "nonzero"
}
```

The above is preferable to:

``` kotlin
if (x)
    return foo()
else
    return bar()
    
when(x) {
    0 -> return "zero"
    else -> return "nonzero"
}    
```

### `if` versus `when`

Prefer using `if` for binary conditions instead of `when`. Instead of

``` kotlin
when (x) {
    null -> ...
    else -> ...
}
```

use `if (x == null) ... else ...`

Prefer using `when` if there are three or more options.

### Formatting `when` statements

In a `when` statement, if a branch is more than a single line, always separate it from adjacent case blocks with a blank line:

```
private fun parsePropertyValue(propName: String, token: Token) {
    when (token) {
        is Token.ValueToken ->
            callback.visitValue(propName, token.value)

        Token.LBRACE -> { // ...
        }
    }
}    
```

Put short branches on the same line as the condition, without braces.

```
when (foo) {
    true -> bar() //good
    false -> { baz() } //bad
}
```

### Using nullable `Boolean` values in conditions

If you need to use a nullable `Boolean` in a conditional statement, use `if (value == true)` or `if (value == false)` checks.

## Using loops

Prefer using higher-order functions (`filter`, `map` etc.) to loops. Exception: `forEach` (prefer using a regular for loop instead,
unless the receiver of `forEach` is nullable or `forEach` is used as part of a longer call chain).

When making a choice between a complex expression using multiple higher-order functions and a loop, understand the cost
of the operations being performed in each case and keep performance considerations in mind. 

### Loops on ranges

Use the `until` function to loop over an open range:

```kotlin
for (i in 0..n - 1) { ... }  // bad
for (i in 0 until n) { ... }  // good
```

## Functions vs Properties

In some cases functions with no arguments might be interchangeable with read-only properties. 
Although the semantics are similar, there are some stylistic conventions on when to prefer one to another.

Prefer a property over a function when the underlying algorithm:

* does not throw
* is cheap to calculate (or caсhed on the first run)
* returns the same result over invocations if the object state hasn't changed

## Using extension functions

Use extension functions liberally. Every time you have a function that works primarily on an object, consider making it
an extension function accepting that object as a receiver. To minimize API pollution, restrict the visibility of
extension functions as much as it makes sense. As necessary, use local extension functions, member extension functions,
or top-level extension functions with private visibility.

## Using infix functions

Declare a function as infix only when it works on two objects which play a similar role. Good examples: `and`, `to`, `zip`.
Bad example: `add`.

Don't declare a method as infix if it mutates the receiver object.

## Factory functions

If you declare a factory function for a class, don't give it the same name as the class itself. Use a distinct name
making it clear why the behavior of the factory function is special. Example:

``` kotlin
class Point(val x: Double, val y: Double) {
    companion object {
        fun fromPolar(angle: Double, radius: Double) = Point(...)
    }
}
```

If you have an object with multiple overloaded constructors that don't call different superclass constructors and
can't be reduced to a single constructor with default argument values, prefer to replace the overloaded constructors with
factory functions.

## Modifiers

If a declaration has multiple modifiers, always put them in the following order:

```
public / protected / private / internal
final / open / abstract / sealed / const
external
override
lateinit
tailrec
vararg
suspend
inner
enum / annotation
companion
inline
infix
operator
data
```

Place all annotations before modifiers:

```
@Named("Foo") 
private val foo: Foo
```

## Platform types

A public function/method returning an expression of a platform type must declare its kotlin type explicitly:

``` kotlin
fun apiCall(): String = MyJavaApi.getProperty("name")
```

Any property (package-level or class-level) initialised with an expression of a platform type must declare its kotlin type explicitly:

``` kotlin
class Person {
    val name: String = MyJavaApi.getProperty("name")
}
```

A local value initialised with an expression of a platform type may or may not have a type declaration:

``` kotlin
fun main(args: Array<String>) {
    val name = MyJavaApi.getProperty("name")
    println(name)
}
```

## Using scope functions apply/with/run/also/let

### apply

Use `apply` for initialization:

```kotlin
val foo = createBar().apply {
    property = value
    init()
}
```

### also

Use `also` over `apply` if the receiver is used for anything other than setting properties or function calls **on it**,
or if the receiver is not used at all in the lambda.

```kotlin
class Baz {
    var currentBar: Bar?
    val observable: Observable

    val foo = createBar().also {
        currentBar = it
        observable.registerCallback(it)
    }
}
```

Prefer `also` over `apply` if there already are multiple receivers in scope, especially if you make calls on any outer receivers:

```kotlin
class Foo {
    fun Bar.baz() {
        val stuff = callSomething().also {
            it.init()
            this@baz.registerCallback(it)
        }
    }
}
```

### apply/with/run

Prefer `apply`/`run` over `with` if the receiver is nullable.

```kotlin
getNullable()?.run {
    init()
}

getNullable()?.apply {
    init()
}
```

Prefer `run`/`with` over `apply` if the returned value is not used

```kotlin
view.run {
    textView.text = "Hello World"
    progressBar.init()
}

with(view) {
    textView.text = "Hello World"
    progressBar.init()
}
```

Choose one of the above and use it consistently.

### let

Prefer `let` over `run` in method chains that transform the receiver

```kotlin
val baz: Baz = foo.let { createBar(it) }.convertBarToBaz()
// or with function references
val baz: Baz = foo.let(::createBar).convertBarToBaz()
```

## String literals

### String templates

Prefer using string templates to string concatenation.

Don't use curly braces when inserting a simple variable into a string template. Use curly braces only for longer expressions.

``` kotlin
println("$name has ${children.size} children")
```

### Multiline strings

Prefer to use multiline strings instead of embedding `\n` escape sequences into regular string literals.

Use `trimIndent` to maintain indentation in multiline strings:

``` kotlin
assertEquals("""Foo
                Bar""".trimIndent(), value)
```

## Coding conventions for libraries

When writing libraries, it's recommended to follow an additional set of rules to ensure API stability:

 * Always explicitly specify member visibility (to avoid accidentally exposing declarations as public API)
 * Always explicitly specify function return types and property types (to avoid accidentally changing the return type
   when the implementation changes)
 * Provide KDoc comments for all public methods (to support generating documentation for the library)
