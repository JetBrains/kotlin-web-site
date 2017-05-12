### Concise

Create a POJO with getters, setters, `equals()`, `hashCode()`, `toString()` and `copy()` in a single line:

``` kotlin
data class Customer(val name: String, val email: String, val company: String)
```

Or filter a list using a lambda expression:

``` kotlin
val positiveNumbers = list.filter { it > 0 }
```

Want a singleton? Create an object:

``` kotlin
object ThisIsASingleton {
    val companyName: String = "JetBrains"
}
```