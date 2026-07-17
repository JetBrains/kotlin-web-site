[//]: # (title: This expressions)

The `this` expression refers to the current receiver. How you use `this` depends on the context:

* In a member of a [class](classes.md), `this` refers to the current object of that class.

  For example, in the following code, `this.name` means the `name` property of the current `Language` object:

  ```kotlin
  class Language(val name: String) {
      fun printName() {
          println(this.name)
      }
  }

  fun main() {
      val language = Language("Kotlin")
      language.printName()
      // Kotlin
  }
  ```
  {kotlin-runnable="true"}

* In an [extension function](extensions.md) or a [function literal with receiver](lambdas.md#function-literals-with-receiver),
`this` refers to the receiver. 

  In the following example, `lastCharacter()` is called on the string `"Kotlin"`. Therefore, `"Kotlin"` is the receiver.
  Inside the extension function, `this` refers to `"Kotlin"`. This means that `this.length` is the length of `"Kotlin"`:

  ```kotlin
  fun String.lastCharacter(): Char {
      println(this.length)
      // 6
      return this[this.length - 1]
  }

  fun main() {
      println("Kotlin".lastCharacter())
      // n
  }
  ```
  {kotlin-runnable="true"}

> In simple cases, you don't need to write `this` explicitly. Kotlin resolves it from the current scope.
> Learn more about [](#implicit-this).
> 
{style="tip"}

## Qualified `this`

Your code can have several receivers available at the same time when receiver scopes are nested. Kotlin can use any
available receiver to access its members implicitly, but receivers from inner scopes have higher priority. To explicitly
refer to a particular receiver, use a qualified `this`. It is especially useful when multiple receivers have members with
the same name, and you need to access a member of an outer receiver.

To use a qualified `this`, add a [label](returns.md) qualifier:

```kotlin
this@label
```

The label tells the compiler which receiver to access. You can use the name of an enclosing class or extension function.
For example, `this@foo` refers to the receiver of an enclosing extension function named `foo`.

### Access an outer class from an inner class

In an [inner class](nested-classes.md#inner-classes), unqualified `this` refers to the inner class instance. To access the outer class object,
use qualified `this`:

```kotlin
class User(val name: String) {
    inner class Age(val value: Int) {
        fun printInfo() {
            
            // Refers to the value property of the current Age object
            println(this.value)
            // 22
            
            // Refers to the name property of the outer User object 
            println(this@User.name)
            // Jane Doe
        }
    }
}

fun main() {
    val user = User("Jane Doe")
    val age = user.Age(22)
    age.printInfo()
}
```
{kotlin-runnable="true"}

> Only inner classes hold a reference to an outer class instance. Regular [nested classes](nested-classes.md) don't have access to
> `this` from the outer class.
> 
{style="note"}

### Access a class from an extension function

If you declare an extension function inside a class, two receivers are available:

* The extension receiver: the value on which you call the extension function.
* The dispatch receiver: the current object of the class where you declare the extension function.

Use qualified `this` to specify which receiver you need:

```kotlin
class User(val name: String) {
    val prefix = "Name"

    fun String.formatName(): String {
        return "${this@User.prefix}: ${this.uppercase()}"
    }

    fun printName() {
        println(name.formatName())
    }
}

fun main() {
    val user = User("Jane Doe")
    user.printName()
    // Name: JANE DOE
}
```
{kotlin-runnable="true"}

Here:

* `this` refers to the extension receiver (`String`), so `this.uppercase()` converts the string to uppercase.
* `this@User` refers to the current `User` object.
* `this@User.prefix` accesses the `prefix` property of the current `User` object.

### Access from a lambda

Unlike a regular lambda, a [lambda with receiver](lambdas.md#function-literals-with-receiver)￼introduces a receiver into its scope.
As a result, `this` inside the lambda refers to the lambda's receiver, not to one from an enclosing scope.
If a lambda with receiver is nested inside another receiver scope, add a label to the lambda and use a qualified `this`
to refer explicitly to the lambda's receiver or to a receiver from an enclosing scope:

```kotlin
class User(val name: String) {
    fun printWithPrefix() {
        val printString: String.() -> Unit = stringLabel@ {
            println("${this@stringLabel}: ${this@User.name}")
        }

        printString("User")
    }
}

fun main() {
    val user = User("Jane Doe")
    user.printWithPrefix()
    // User: Jane Doe
}
```
{kotlin-runnable="true"}

Here: 

* `stringLabel@` labels the lambda.
* `this@stringLabel` refers to the string receiver of the lambda.
* `this@User` refers to the current `User` object.

The label doesn't call anything or change how the lambda works. It only helps you refer to the lambda's receiver.

### Access an anonymous object or its outer class

An [anonymous object](object-declarations.md#object-expressions) has its own receiver scope. Inside the object body, unqualified `this` refers to the anonymous object
itself. However, since anonymous objects don't have class names, you can't use them as `this` qualifiers. Therefore,
you can refer to the anonymous object only with unqualified `this`:

```kotlin
interface UserPrinter {
    fun print()
}

fun main() {
    val printer = object : UserPrinter {
        val prefix = "User"
        
        override fun print() {
            // this refers to the anonymous object, so this.prefix accesses its `prefix` property
            println(this.prefix)
        }
    }
    printer.print()
    // User
}
```
{kotlin-runnable="true"}

If you declare an anonymous object inside another class, you can use qualified `this` to access the enclosing object:

```kotlin

interface UserPrinter {
    fun print()
}

class User(val name: String) {
    fun createPrinter(): UserPrinter {
        return object : UserPrinter {
            override fun print() {
                // this@User refers to the enclosing `User` object, so this@User.name accesses its name property
                println(this@User.name)
            }
        }
    }
}

fun main() {
    val printer = User("Jane Doe").createPrinter()
    printer.print()
    // Jane Doe
}
```

{kotlin-runnable="true"}

## Implicit `this`

When you call a member function on `this`, you can omit the `this.` qualifier.
However, if another callable with the same name is available in a closer lexical scope, Kotlin resolves
the unqualified call to that callable instead of the member function. To explicitly call the member function,
use the `this.` qualifier:

```kotlin
fun main() {
    class A {
        fun printLine() {
            println("Member function")
        }

        fun invokePrintLine() {
            fun printLine() {
                println("Local function")
            }
         
            printLine()
            // Local function
         
            this.printLine()
            // Member function
        }
    }

    A().invokePrintLine()
}
```
{kotlin-runnable="true"}