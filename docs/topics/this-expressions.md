[//]: # (title: This expressions)

The `this` expression refers to the current object or receiver.

How you use `this` depends on the context:

* In a member of a [class](classes.md#inheritance), `this` refers to the current object of that class.

  For example, in the following code, `this.name` means the `name` property of the current `Language` object:

  ```kotlin
  //sampleStart
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
  //sampleEnd
  ```
  {kotlin-runnable="true"}

* In an [extension function](extensions.md) or a [function literal with receiver](lambdas.md#function-literals-with-receiver),
`this` refers to the receiver (the object with which the function works). 

  In the following example, we call `lastCharacter()`on the string `"Kotlin"`. Inside the extension function, this refers
  to `"Kotlin"`. This means that `this.length` is the length of `"Kotlin"`:

  ```kotlin
  //sampleStart
  fun String.lastCharacter(): Char {
      println(this.length)
      // 6
      return this[this.length - 1]
  }

  fun main() {
      println("Kotlin".lastCharacter())
      // n
  }
  //sampleEnd
  ```
  {kotlin-runnable="true"}

> In simple cases, you don't need to write `this` explicitly. Kotlin infers it from the current scope.
> Learn more about [](#implicit-this).
> 
{style="tip"}

## Qualified this

Kotlin code can have several possible `this` values at the same time. This happens when receiver scopes are nested. For
example, an inner class can access both its own object and the outer class object. In such cases, plain `this` refers
to the receiver of the _innermost enclosing scope_. To refer to a receiver from an outer scope, use a qualified `this`.

To use a qualified `this`, add a label qualifier:

```kotlin
this@label
```

The label tells the compiler which receiver to access. You can use the name of an enclosing class or extension function.
For example, `this@foo` refers to the receiver of an enclosing extension function named `foo`.

### Access an outer class from an inner class

In an [inner class](nested-classes.md#inner-classes), plain `this` refers to the inner class instance. To access the outer class object,
use qualified `this`:

```kotlin
//sampleStart
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
//sampleEnd
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
//sampleStart
class User {
    val prefix = "Name"
    
    fun String.formatName(): String {
        return "${this@User.prefix}: ${this.uppercase()}"
    }

    fun printUser() {
        println("Jane Doe".formatName())
    }
}

fun main() {
    val user = User()
    user.printUser()
    // Name: JANE DOE
}
//sampleEnd
```
{kotlin-runnable="true"}

Here:

* `this` refers to the extension receiver (the string `"Jane Doe"`).
* `this@User` refers to the current `User` object.
* `this@User.prefix` accesses the prefix property of the current `User` object.

### Access a receiver from a lambda

Unlike a regular lambda, a [lambda with receiver](lambdas.md#function-literals-with-receiver) has its own receiver. Therefore, `this` inside it
refers to that receiver. If a lambda with receiver is nested inside another receiver scope, add a label to the lambda
and use qualified `this` to specify which receiver you need:

```kotlin
//sampleStart
class User(val name: String) {
    fun printWithPrefix() {
        val print: String.() -> Unit = stringLabel@ {
            println("${this@stringLabel}: ${this@User.name}")
        }
      
        print("User")
    }
}

fun main() {
    val user = User("Jane Doe")
    user.printWithPrefix()
    // User: Jane Doe
}
//sampleEnd
```
{kotlin-runnable="true"}

Here: 

* `stringLabel@` labels the lambda.
* `this@stringLabel` refers to the string receiver of the lambda.
* `this@User` refers to the current `User` object.

The label doesn't call anything or change how the lambda works. It only helps you refer to the lambda's receiver.

### Access an anonymous object

Since anonymous objects don’t have class names, you can't use a class name like `this@YourClassName` to refer
to it. Inside an anonymous object, use plain `this` to refer to the object:

```kotlin
//sampleStart
interface UserPrinter {
    fun print()
}

fun printUser(printer: UserPrinter) {
    printer.print()
}

fun main() {
    val printer = object : UserPrinter {
        val name = "Jane Doe"
      
        override fun print() {
            // Refers to the name property of the anonymous object
            println(this.name)
        }
    }
    printUser(printer)
    // Jane Doe
}
//sampleEnd
```
{kotlin-runnable="true"}

> If you create an anonymous object inside another class, you can use qualified `this` to access the outer class object.
> Use it to access an outer receiver, not the anonymous object itself.
> 
{style="tip"}


## Implicit this

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