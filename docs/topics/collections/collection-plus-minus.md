[//]: # (title: Plus and minus operators)

In Kotlin, [`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) and [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html)
(`-`) operators are defined for collections.
They take a collection as the first operand; the second operand can be either an element or another collection.
The return value is a new read-only collection:

* The result of `plus` contains the elements from the original collection _and_ from the second operand.
* The result of `minus` contains the elements of the original collection _except_ the elements from the second operand.
   If it's an element, `minus` removes its _first_ occurrence; if it's a collection, _all_ occurrences of its elements are removed.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val plusList = numbers + "five"
    val minusList = numbers - listOf("three", "four")
    println(plusList)
    println(minusList)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For the details on `plus` and `minus` operators for maps, see [Map specific operations](map-operations.md).
The [augmented assignment operators](operator-overloading.md#augmented-assignments) [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html)
(`+=`) and [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) are
also defined for collections. However, for read-only collections, they actually use the `plus` or `minus` operators and
try to assign the result to the same variable. Thus, they are available only on `var` read-only collections.
For mutable collections, they modify the collection if it's a `val`. For more details see [Collection write operations](collection-write.md).
