import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class UpdateEmailTest {
    @Test
    fun testUpdateEmail() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        val user = User(1, "old_email@example.com")
        val updatedUser = updateEmail(user, "new_email@example.com")
        assertEquals("new_email@example.com", updatedUser.email)
        assertEquals(1, updatedUser.id)
        assertEquals("Updating email for user with ID: 1", out.toString().trim())
    }
}
