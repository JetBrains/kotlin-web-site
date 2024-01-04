[//]: # (title: Booleans)

The type `Boolean` represents boolean objects that can have two values: `true` and `false`. 

> On the JVM, booleans stored as primitive type: `boolean`, typically use 8 bits.
>
{type="note"}

`Boolean` has a nullable counterpart `Boolean?` that also has the `null` value.

Built-in operations on booleans include:

* `||` – disjunction (logical _OR_)
* `&&` – conjunction (logical _AND_)
* `!` – negation (logical _NOT_)

`||` and `&&` work lazily.

```kotlin
fun main() {
//sampleStart
    val myTrue: Boolean = true
    val myFalse: Boolean = false
    val boolNull: Boolean? = null
    
    println(myTrue || myFalse)
    println(myTrue && myFalse)
    println(!myTrue)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> On the JVM, nullable references to boolean objects are boxed in Java classes, just like with [numbers](numbers.md#numbers-representation-on-the-jvm).
>
{type="note"}