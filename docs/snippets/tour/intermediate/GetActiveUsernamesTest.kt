import kotlin.test.Test
import kotlin.test.assertEquals

class GetActiveUsernamesTest {
    @Test
    fun testGetActiveUsernames() {
        val allUsers = listOf(
            User("alice123", true),
            User("bob_the_builder", false),
            User("charlie99", true)
        )
        assertEquals(listOf("alice123", "charlie99"), getActiveUsernames(allUsers))
    }
}
