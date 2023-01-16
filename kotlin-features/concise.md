<div class="sample" markdown="1" mode="kotlin" theme="kotlin-docs" auto-indent="false">
```kotlin
data class Employee(
   val name: String,
   val email: String,
   val company: String
) // + automatically generated equals(), hashCode(), toString(), and copy()

object MyCompany {                                // A singleton
   const val name: String = "MyCompany"
}

fun main() {                                      // Function at the top level
   val employee = Employee("Alice",               // No `new` keyword
      "alice@mycompany.com", MyCompany.name)
   println(employee)
}

```
</div>
