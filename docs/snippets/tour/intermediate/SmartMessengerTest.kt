import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test

class SmartMessengerTest {
    private fun smartMessengerOf(): Any = SmartMessenger(BasicMessenger())

    @Test
    fun `send a smart message and pass it on to the basic messenger`() {
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
                        "override, not on the SmartMessenger itself. Calling it on " +
                        "itself loops forever.",
                ""
            ) else hint(
                "Make sendMessage() print the messages. Calling it throws " +
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
                "Keep the code in main() as it is. It prints the four " +
                        "lines shown in its comments."
            )

            else -> passed(
                "Checked: SmartMessenger's sendMessage() prints the smart message " +
                        "and the [smart]-prefixed basic message for any input, and " +
                        "receiveMessage() answers like BasicMessenger. Whether it is " +
                        "wired with the by keyword rather than written by hand is " +
                        "not checked. Compare with the example solution."
            )
        }
    }
}
