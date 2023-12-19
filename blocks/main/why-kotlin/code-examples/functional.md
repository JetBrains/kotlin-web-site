fun main() {
    // Who sent the most messages?
    val frequentSender = messages
        .groupBy(Message::sender)
        .maxByOrNull { (_, messages) -> messages.size }
        ?.key                                                 // Get their names
    println(frequentSender) // [Ma]

    // Who are the senders?
    val senders = messages
        .asSequence()                                         // Make operations lazy (for a long call chain)
        .filter { it.body.isNotBlank() && !it.isRead }        // Use lambdas...
        .map(Message::sender)                                 // ...or member references
        .distinct()
        .sorted()
        .toList()                                             // Convert sequence back to a list to get a result
    println(senders) // [Adam, Ma]
}

data class Message(                                           // Create a data class
    val sender: String,
    val body: String,
    val isRead: Boolean = false,                              // Provide a default value for the argument
)

val messages = listOf(                                        // Create a list
    Message("Ma", "Hey! Where are you?"),
    Message("Adam", "Everything going according to plan today?"),
    Message("Ma", "Please reply. I've lost you!"),
)