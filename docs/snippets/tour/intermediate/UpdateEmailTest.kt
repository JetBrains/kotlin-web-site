import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test

class UpdateEmailTest {
    private fun update(user: User): User = updateEmail(user, "fresh@mail.com")

    @Test
    fun `update the email and log the change`() {
        val user = User(7, "old@mail.com")
        val captured = ByteArrayOutputStream()
        val originalOut = System.out
        val emailCheck = try {
            System.setOut(PrintStream(captured))
            expect("updateEmail(user, \"fresh@mail.com\").email", "fresh@mail.com") {
                update(user).email
            }
        } finally {
            System.setOut(originalOut)
        }
        val log = captured.toString().trim()
        when {
            emailCheck.thrown is NotImplementedError -> hint(
                "Replace the TODO(\"Write your code here\") with your code that " +
                        "updates the email and logs the update.",
                ""
            )

            emailCheck.thrown != null || !emailCheck.isCorrect -> hint(
                "Set the email property to newEmail inside the apply scope " +
                        "function. It works on the object it is called on and " +
                        "returns that same object.",
                emailCheck
            )

            user.email != "fresh@mail.com" -> hint(
                "Update the User object that main() passes in, rather than " +
                        "building a new one. The apply scope function changes " +
                        "the object it is called on.",
                expect("user.email after the call", "fresh@mail.com") { user.email }
            )

            "Updating email for user with ID: 7" !in log.lines() -> when {
                "ID: 1" in log -> hint(
                    "Take the ID for the log message from the user being " +
                            "updated. Inside also, it refers to that user. For a " +
                            "user with ID 7 the log says \"Updating email " +
                            "for user with ID: 7\".",
                    log
                )

                else -> hint(
                    "Print the log message with the also scope function after " +
                            "the update, for example for a user with ID 7: " +
                            "\"Updating email for user with ID: 7\".",
                    log
                )
            }

            "Updated User: User(id=1, email=new_email@example.com)" !in output.lines() -> hint(
                "Keep the println(...) call in main() as it is. It prints " +
                        "\"Updated User: User(id=1, email=new_email@example.com)\"."
            )

            else -> passed(
                "Checked: updateEmail() sets the new email on the user it " +
                        "receives and logs the update with the user's own ID. " +
                        "Whether apply and also are used is not checked. " +
                        "Compare with the example solution."
            )
        }
    }
}
