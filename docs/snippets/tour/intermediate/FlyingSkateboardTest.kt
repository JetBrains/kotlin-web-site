import kotlin.test.Test

class FlyingSkateboardTest {
    private fun skateboard(): Any = FlyingSkateboard

    @Test
    fun `move and fly the skateboard`() {
        val vehicle = skateboard() as? Vehicle ?: hint(
            "Make FlyingSkateboard inherit from the Vehicle interface. Add " +
                    ": Vehicle after its name and override the name property and " +
                    "the move() function.",
            ""
        )
        val nameCheck = expect("FlyingSkateboard.name", "Flying Skateboard") {
            vehicle.name
        }
        val moveCheck = expect(
            "FlyingSkateboard.move()",
            "Glides through the air with a hover engine"
        ) {
            vehicle.move()
        }
        when {
            !nameCheck.isCorrect -> hint(
                "Set the name property to \"Flying Skateboard\". main()'s " +
                        "comments show it at the start of both printed lines.",
                nameCheck
            )

            !moveCheck.isCorrect -> hint(
                "Return \"Glides through the air with a hover engine\" from " +
                        "move(), as main()'s first comment shows.",
                moveCheck
            )

            "Flying Skateboard: Woooooooo" !in output.lines() -> hint(
                "Add your own fly() function to FlyingSkateboard that returns " +
                        "\"Woooooooo\". main() prints it as the second line."
            )

            output.lines() != listOf(
                "Flying Skateboard: Glides through the air with a hover engine",
                "Flying Skateboard: Woooooooo",
            ) -> hint(
                "Keep the code in main() as it is. It prints the two " +
                        "lines shown in its comments."
            )

            else -> passed(
                "Checked: FlyingSkateboard is an object implementing Vehicle " +
                        "whose name is \"Flying Skateboard\" and whose move() " +
                        "returns \"Glides through the air with a hover engine\", " +
                        "and its own fly() function returns \"Woooooooo\"."
            )
        }
    }
}
