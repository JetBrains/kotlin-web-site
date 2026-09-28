import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test

class SmartMessengerTest {
    private fun smartMessengerOf(): Any = SmartMessenger(BasicMessenger())

    @Test
    fun `send a message through BasicMessenger`() {
        val created = try {
            smartMessengerOf()
        } catch (e: Throwable) {
            hint(
                "Give SmartMessenger a constructor that accepts a BasicMessenger, " +
                        "the way main() creates it. SmartMessenger(BasicMessenger()) " +
                        "throws ${e::class.simpleName}.",
                ""
            )
        }
        val messenger = created as? Messenger ?: hint(
            "Make SmartMessenger inherit from the Messenger interface and " +
                    "delegate the implementation to a BasicMessenger with the by " +
                    "keyword.",
            ""
        )
        val receivedCheck = expect("smartMessenger.receiveMessage()", "You've got a new message!") {
            messenger.receiveMessage()
        }
        val captured = ByteArrayOutputStream()
        val originalOut = System.out
        val sent = try {
            System.setOut(PrintStream(captured))
            messenger.sendMessage("Good news!")
            captured.toString().trim()
        } catch (e: Throwable) {
            // Printing the smart message on every recursive call fills the
            // capture buffer before the stack overflows, so an endless
            // self-call can also surface as OutOfMemoryError.
            if (e is StackOverflowError || e is OutOfMemoryError) hint(
                "Call sendMessage() on the BasicMessenger instance inside your " +
                        "override, not on the SmartMessenger itself. SmartMessenger." +
                        "sendMessage() invokes itself recursively.",
                ""
            ) else hint(
                "Make sendMessage() print both messages without throwing " +
                        "${e::class.simpleName}.",
                ""
            )
        } finally {
            System.setOut(originalOut)
        }
        val lines = sent.lines()
        when {
            !receivedCheck.isCorrect -> hint(
                "Delete your own receiveMessage() from SmartMessenger. Delegating " +
                        "with the by keyword gives you BasicMessenger's version for " +
                        "free.",
                receivedCheck
            )

            sent.isEmpty() -> hint(
                "Override sendMessage() in SmartMessenger so it prints the smart " +
                        "message and passes the message on to the BasicMessenger.",
                ""
            )

            lines.getOrNull(0) != "Sending a smart message: Good news!" -> hint(
                "Make your sendMessage() override print \"Sending a smart " +
                        "message: \$message\" first. For this message that is " +
                        "\"Sending a smart message: Good news!\".",
                sent
            )

            lines.getOrNull(1) != "Sending message: [smart] Good news!" -> hint(
                "Call sendMessage() on the BasicMessenger from your override, " +
                        "prefixing the message with [smart]. That call prints " +
                        "\"Sending message: [smart] Good news!\".",
                sent
            )

            lines.size != 2 -> hint(
                "Print exactly two lines from sendMessage(). It prints " +
                        "${lines.size} lines instead of 2.",
                sent
            )

            output.lines() != listOf(
                "Sending message: Hello!",
                "You've got a new message!",
                "Sending a smart message: Hello from SmartMessenger!",
                "Sending message: [smart] Hello from SmartMessenger!",
            ) -> hint(
                "Keep the code in main() as it is. It prints the BasicMessenger " +
                        "message \"Sending message: Hello!\", the response \"You've got " +
                        "a new message!\", the smart message \"Sending a smart message: " +
                        "Hello from SmartMessenger!\", and \"Sending message: [smart] " +
                        "Hello from SmartMessenger!\"."
            )

            else -> passed(
                "SmartMessenger.sendMessage() prints the smart message and the " +
                        "[smart]-prefixed BasicMessenger message, and receiveMessage() " +
                        "returns \"You've got a new message!\". The test doesn't check " +
                        "whether you delegate to BasicMessenger with the by keyword."
            )
        }
    }
}
