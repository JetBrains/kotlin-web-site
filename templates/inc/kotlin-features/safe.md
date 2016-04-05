### Safe

Get rid of those pesky NullPointerExceptions, you know, The Billion Dollar Mistake

``` kotlin
var output : String
output = null
```

And of course, Kotlin protects you from mistakenly operating on nullable types,
including those from Java

``` kotlin
println(output.length())
```

And if you check a type is right, the compiler will auto-cast it for you

``` kotlin
fun calculateTotal(obj: Any) {
  if (obj is Invoice) {
    obj.calculateTotal()
  }
}
```