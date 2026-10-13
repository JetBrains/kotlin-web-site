import kotlin.test.Test

class GetNotificationPreferencesTest {
    private fun prefs(user: Any, email: Boolean, sms: Boolean): Any? =
        getNotificationPreferences(user, emailEnabled = email, smsEnabled = sms)

    private fun check(call: String, expected: List<String>, user: Any, email: Boolean, sms: Boolean) =
        expect(call, expected) { prefs(user, email, sms) }

    private fun flagOf(line: Any?): String =
        if (line.toString().startsWith("SMS")) "smsEnabled" else "emailEnabled"

    private fun quote(line: Any?): String = "\"" + escapeHtml(line.toString()) + "\""

    @Test
    fun `return enabled notifications`() {
        val checks = listOf(
            check(
                "getNotificationPreferences(User(\"Maya\"), emailEnabled = true, smsEnabled = true)",
                listOf("Email Notifications enabled for Maya", "SMS Notifications enabled for Maya"),
                User("Maya"), email = true, sms = true,
            ),
            check(
                "getNotificationPreferences(User(\"Leo\"), emailEnabled = true, smsEnabled = false)",
                listOf("Email Notifications enabled for Leo"),
                User("Leo"), email = true, sms = false,
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
                "getNotificationPreferences() includes only the enabled notifications " +
                        "for a valid user, uses \"Guest\" for a null name, and " +
                        "returns an empty list for a value that is not a User. " +
                        "The test doesn't check whether you use as?, ?:, and " +
                        "takeIf() as steps 1 to 3 describe."
            )

            else -> {
                val expected = failed.expected as List<*>
                val actual = failed.actual as? List<*> ?: emptyList<Any?>()
                val extra = actual.firstOrNull { it !in expected }
                val missing = expected.firstOrNull { it !in actual }
                when {
                    "User(null)" in failed.call && failed.thrown is NullPointerException -> hint(
                        "Default the name to \"Guest\" with the Elvis operator instead " +
                                "of asserting it with !!. User(null) has no name, so !! " +
                                "stops the program.",
                        failed
                    )

                    "User(null)" in failed.call && failed.thrown == null &&
                            actual.none { "Guest" in it.toString() } -> hint(
                        "Default the name to \"Guest\" with the Elvis operator when the " +
                                "user's name is null. For User(null), the SMS line reads " +
                                "${quote(expected.first())}.",
                        failed
                    )

                    failed.thrown is ClassCastException -> hint(
                        "Use the safe cast as? instead of as. For 42, as throws " +
                                "ClassCastException, while as? gives null, so the Elvis " +
                                "operator can return emptyList().",
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

                    null in actual -> hint(
                        "Use listOfNotNull() to drop notification lines that are null " +
                                "when the corresponding notification is disabled.",
                        failed
                    )

                    actual.size > expected.size && extra != null -> hint(
                        "Leave out ${quote(extra)} because ${flagOf(extra)} is false " +
                                "in this call. takeIf { ${flagOf(extra)} } gives null for " +
                                "this line, and listOfNotNull() drops it.",
                        failed
                    )

                    actual.size < expected.size && missing != null -> hint(
                        "Include ${quote(missing)} because ${flagOf(missing)} is true " +
                                "in this call. Check that the condition in takeIf() for " +
                                "this line is ${flagOf(missing)}.",
                        failed
                    )

                    actual.size == 1 && expected.size == 1 && extra != null &&
                            extra.toString().substringAfter(' ') ==
                            expected.single().toString().substringAfter(' ') -> hint(
                        "Swap the conditions in takeIf(). The email line depends on " +
                                "emailEnabled, and the SMS line depends on smsEnabled.",
                        failed
                    )

                    actual.any { "User(" in it.toString() } -> hint(
                        "Use userName in the string templates, not validUser. " +
                                "\$validUser prints the whole User object instead of " +
                                "the name.",
                        failed
                    )

                    actual.size == expected.size && extra != null -> hint(
                        "Write ${quote(expected[actual.indexOf(extra)])} exactly. " +
                                "Check the spelling, the capitalization, and the space " +
                                "before the name.",
                        failed
                    )

                    actual.toSet() == expected.toSet() -> hint(
                        "Put the email notification before the SMS notification " +
                                "in listOfNotNull().",
                        failed
                    )

                    else -> hint(
                        "Include each notification line only when it is enabled. " +
                                "takeIf() keeps the string when its condition is true, and " +
                                "listOfNotNull() drops the null values.",
                        failed
                    )
                }
            }
        }
    }
}
