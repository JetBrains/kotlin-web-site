import kotlin.test.Test

class GetActiveUsernamesTest {
    private fun usernames(users: List<User>): Any? = getActiveUsernames(users)

    @Test
    fun `keep only the active usernames`() {
        val mixed = listOf(
            User("dana", true),
            User("eli", false),
            User("finn_dev", true),
            User("gwen", false),
        )
        val checks = listOf(
            expect(
                "getActiveUsernames() with active users dana and finn_dev",
                listOf("dana", "finn_dev"),
            ) { usernames(mixed) },
            expect(
                "getActiveUsernames() with no active users",
                emptyList<String>(),
            ) { usernames(listOf(User("hana", false))) },
        )
        when (val failed = checks.firstMismatch()) {
            null -> passed(
                "Checked: getActiveUsernames() returns the usernames of active " +
                        "users and leaves the inactive ones out. Whether it is a " +
                        "single mapNotNull() lambda is not checked. Compare with " +
                        "the example solution."
            )

            else -> when {
                failed.thrown != null -> hint(
                    "Return the username or null from the lambda. mapNotNull() " +
                            "must not throw an exception for inactive users.",
                    failed
                )

                "eli" in failed.actual.toString() || "hana" in failed.actual.toString() -> hint(
                    "Return null from the lambda when the user is not active. " +
                            "mapNotNull() then leaves that user out.",
                    failed
                )

                failed.actual == emptyList<Any?>() -> hint(
                    "Return the user's username from the lambda when the user is " +
                            "active.",
                    failed
                )

                else -> hint(
                    "Make the lambda return the username for active users and " +
                            "null for inactive ones.",
                    failed
                )
            }
        }
    }
}
