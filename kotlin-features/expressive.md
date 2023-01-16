<div class="sample" markdown="1" mode="kotlin" theme="kotlin-docs" auto-indent="false">
``` kotlin
fun main() {
//sampleStart
   val map = mapOf(1 to "one", 2 to "two")
   for ((k, v) in map) {                            // Traverse a map or a list of pairs
       println("$k -> $v")
   }

   fun obtainKnowledge() = Pair("The Answer", 42)   // Single-expression functions

   val (description, answer) = obtainKnowledge()    // Destructure into a pair of two variables
   println("$description: $answer")
    
   getText()?.let {                                 // Apply an action to a nullable expression
      sendEmailTo("alice@example.com", it)          // if it’s not null 
   }

   createEmptyWindow()
      .apply {                                    // Configure properties of an object
         width = 300
         height = 200
         isVisible = true
      }.also { w ->                               // Perform an additional operation on a call chain
         showWindow(w)
      }

   val fixedIssue = issueById["13456"]
       ?.takeIf { it.status == Status.FIXED }       // Use the value only if the condition is true
   println(fixedIssue)
//sampleEnd
}

data class Window(var width: Int, var height: Int, var isVisible: Boolean)

fun createEmptyWindow() = Window(0, 0, false)

fun showWindow(window: Window) {
   println("Showing $window")
}

fun getText(): String? = "Hi! You've won the lottery! Pay the attached bill to get the prize."
fun sendEmailTo(to: String, message: String) {
   println("Sending email to $to: \n$message")
}

enum class Status { OPEN, FIXED, IN_PROGRESS }
data class Issue(val status: Status)
val issueById = mutableMapOf(
   "13456" to Issue(Status.FIXED)
)
```
</div>
