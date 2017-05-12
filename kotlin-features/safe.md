### Safe

Get rid of those pesky NullPointerExceptions, you know, The Billion Dollar Mistake

``` kotlin
var output: String
output = null   // Compilation error
```

Kotlin protects you from mistakenly operating on nullable types

``` kotlin
val name: String? = null    // Nullable type
println(name.length())      // Compilation error
```

And if you check a type is right, the compiler will auto-cast it for you

``` kotlin
fun calculateTotal(obj: Any) {
    if (obj is Invoice)
        obj.calculateTotal()
}
```