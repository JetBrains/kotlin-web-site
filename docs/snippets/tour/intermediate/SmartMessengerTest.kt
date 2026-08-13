import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class SmartMessengerTest {
    @Test
    fun testSmartMessenger() {
        val basicMessenger = BasicMessenger()
        val smartMessenger = SmartMessenger(basicMessenger)

        assertEquals("You've got a new message!", smartMessenger.receiveMessage())

        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        smartMessenger.sendMessage("Hello from SmartMessenger!")
        val expected = listOf(
            "Sending a smart message: Hello from SmartMessenger!",
            "Sending message: [smart] Hello from SmartMessenger!"
        )
        assertEquals(expected.joinToString("\n"), out.toString().trim())
    }
}
