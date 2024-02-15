[//]: # (title: Booleans)

The type `Boolean` represents boolean objects that can have two values: `true` and `false`. 

> On the JVM, booleans stored as the primitive `boolean` type typically use 8 bits.
>
{type="note"}

`Boolean` has a nullable counterpart (`Boolean?`) with the `null` value.

Built-in operations on booleans include:

* `||` – disjunction (logical _OR_)
* `&&` – conjunction (logical _AND_)
* `!` – negation (logical _NOT_)

For example:

```kotlin
fun main() {
//sampleStart
    val myTrue: Boolean = true
    val myFalse: Boolean = false
    val boolNull: Boolean? = null

    println(myTrue || myFalse)
    // true
    println(myTrue && myFalse)
    // false
    println(!myTrue)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The `||` and `&&` operators work lazily, which means:

* If the first operand is true, the `||` operator does not evaluate the second operand.
* If the first operand is false, the `&&` operator does not evaluate the second operand.

> On the JVM, nullable references to boolean objects are boxed in Java classes, just like with [numbers](numbers.md#numbers-representation-on-the-jvm).
>
{type="note"}