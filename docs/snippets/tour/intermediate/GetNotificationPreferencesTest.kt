import kotlin.test.Test

class GetNotificationPreferencesTest {
    private fun prefs(user: Any, email: Boolean, sms: Boolean): Any? =
        getNotificationPreferences(user, emailEnabled = email, smsEnabled = sms)

    private fun check(call: String, expected: List<String>, user: Any, email: Boolean, sms: Boolean) =
        expect(call, expected) { prefs(user, email, sms) }

    @Test
    fun `build the list of enabled notifications`() {
        val checks = listOf(
            check(
                "getNotificationPreferences(User(\"Maya\"), emailEnabled = true, smsEnabled = true)",
                listOf("Email Notifications enabled for Maya", "SMS Notifications enabled for Maya"),
                User("Maya"), email = true, sms = true,
            ),
            check(
                "getNotificationPreferences(User(null), emailEnabled = false, smsEnabled = true)",
                listOf("SMS Notifications enabled for Guest"),
                User(null), email = false, sms = true,
            ),
            check(
                "getNotificationPreferences(42, emailEnabled = true, smsEnabled = true)",
                emptyList(),
                42, email = true, sms = true,
            ),
        )
        when (val failed = checks.firstMismatch()) {
            null -> passed(
                "Checked: getNotificationPreferences() handles a valid user, a " +
                        "null name, and a value that is not a User. Whether you use " +
                        "as?, ?:, and takeIf() as steps 1 to 3 describe is not checked. " +
                        "Compare with the example solution."
            )

            else -> when {
                failed.thrown is NullPointerException -> hint(
                    "Default the name to \"Guest\" with the Elvis operator instead " +
                            "of asserting it with !!.",
                    failed
                )

                failed.thrown != null -> hint(
                    "Use the safe cast as? with the Elvis operator so that a value " +
                            "that is not a User returns an empty list instead of " +
                            "stopping the program.",
                    failed
                )

                "42" in failed.call -> hint(
                    "Return an empty list when user is not a User. Cast with as? " +
                            "and let the Elvis operator return emptyList() when the " +
                            "cast gives null.",
                    failed
                )

                "null" in failed.actual.toString() -> hint(
                    "Default the name to \"Guest\" with the Elvis operator when the " +
                            "user's name is null.",
                    failed
                )

                else -> hint(
                    "Include each notification line only when it is enabled. " +
                            "takeIf() keeps the string when its condition is true, and " +
                            "listOfNotNull() drops the null ones.",
                    failed
                )
            }
        }
    }
}
