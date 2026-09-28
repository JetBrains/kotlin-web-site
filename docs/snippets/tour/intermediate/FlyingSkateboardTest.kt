import kotlin.test.Test

class FlyingSkateboardTest {
    private fun skateboard(): Any = FlyingSkateboard

    @Test
    fun `make FlyingSkateboard move and fly`() {
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
                "Keep the code in main() as it is. It prints \"Flying Skateboard: " +
                        "Glides through the air with a hover engine\" and \"Flying " +
                        "Skateboard: Woooooooo\"."
            )

            else -> passed(
                "FlyingSkateboard implements Vehicle. Its name is \"Flying " +
                        "Skateboard\", move() returns \"Glides through the air with " +
                        "a hover engine\", and fly() returns \"Woooooooo\"."
            )
        }
    }
}
