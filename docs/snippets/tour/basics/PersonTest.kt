import kotlin.test.Test

class PersonTest {
    private val hashed = Regex("([A-Za-z_]\\w*)@[0-9a-fA-F]+")

    @Test
    fun `print a person with all nested property values`() {
        val values = listOf("John", "Smith", "123 Fake Street", "Springfield", "US")

        when {
            output.lines().any { it.startsWith("Person(") } && values.all { it in output } &&
                    "ownsAPet=false" in output && !hashed.containsMatchIn(output) ->
                passed(
                    "Checked: Name, Address, and City are data classes. " +
                            "The program prints the person with all its nested property values."
                )

            actualOutput.isBlank() -> hint(
                "Keep the println(person) call in main(). It prints the person with all" +
                        "its nested property values once your classes compile",
                ""
            )

            hashed.containsMatchIn(output) -> hint(
                "Add the data keyword to your ${hashed.find(output)!!.groupValues[1]} class. " +
                        "A regular class prints only its name and a code " +
                        "instead of its properties."
            )

            else -> hint(
                "Declare the missing classes with the properties that main() passes to them: " +
                        "two strings for Name, a street and a City for Address, " +
                        "and a name and a country code for City."
            )
        }
    }
}
