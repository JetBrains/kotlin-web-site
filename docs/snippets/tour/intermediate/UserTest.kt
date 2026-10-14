import kotlin.test.Test

class UserTest {
    private fun isValid(email: String): Any? = User.isValidEmail(email)

    private fun check(email: String, expected: Boolean) =
        expect("User.isValidEmail(\"$email\")", expected) { isValid(email) }

    @Test
    fun `return true only for valid emails`() {
        val checks = listOf(
            check("alice@example.com", expected = true),
            check("alice@example.org", expected = true),
            check("bob2example-com", expected = false),
            check("bob@example", expected = false),
            check("bobexample.com", expected = false),
        )
        when (val failed = checks.firstMismatch()) {
            null -> if (output.lines() == listOf(
                    "Registered: Alice, alice@example.com",
                    "Error: 'bob2example-com' is not valid. The email should contain '@' and '.'",
                )
            ) passed(
                "User.isValidEmail() returns true for an address that contains " +
                        "both '@' and '.', and false otherwise. main() registers " +
                        "Alice and reports Bob's address as invalid."
            ) else hint(
                "Keep the code in main() as it is. It prints \"Registered: " +
                        "Alice, alice@example.com\" and \"Error: 'bob2example-com' " +
                        "is not valid. The email should contain '@' and '.'\"."
            )

            else -> when {
                failed.thrown != null -> hint(
                    "Make isValidEmail() return false for an invalid address instead of " +
                            "throwing an exception. Code like email.split(\"@\")[1] or " +
                            "email.substring(email.indexOf('@')) fails when '@' is missing. " +
                            "Use contains() to check for each character.",
                    failed
                )

                "bob@example" in failed.call -> hint(
                    "Check for '.' as well as '@'. An address without a period " +
                            "in the domain is not valid.",
                    failed
                )

                "bobexample.com" in failed.call -> hint(
                    "Check for '@' as well as '.'. An address without @ is not " +
                            "valid.",
                    failed
                )

                else -> hint(
                    "Return true only when the email contains both '@' and '.'. " +
                            "Use contains() for each character.",
                    failed
                )
            }
        }
    }
}
