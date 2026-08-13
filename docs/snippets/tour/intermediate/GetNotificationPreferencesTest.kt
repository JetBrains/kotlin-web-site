import kotlin.test.Test
import kotlin.test.assertEquals

class GetNotificationPreferencesTest {
    @Test
    fun testGetNotificationPreferences() {
        val user1 = User("Alice")
        val user2 = User(null)
        val invalidUser = "NotAUser"

        assertEquals(listOf("Email Notifications enabled for Alice"), getNotificationPreferences(user1, emailEnabled = true, smsEnabled = false))
        assertEquals(listOf("SMS Notifications enabled for Guest"), getNotificationPreferences(user2, emailEnabled = false, smsEnabled = true))
        assertEquals(emptyList(), getNotificationPreferences(invalidUser, emailEnabled = true, smsEnabled = true))
    }
}
