import kotlin.test.Test

class FetchDataTest {
    @Test
    fun `print processed data`() {
        val expected = "Data received - Processed"
        when {
            expected in output.lines() -> passed(
                "The lambda prints \"$expected\". The test doesn't check whether " +
                        "you use append() to add the text."
            )

            output.isEmpty() -> hint(
                "Print the builder's text inside the lambda with " +
                        "println(this.toString()). Here this is the StringBuilder " +
                        "that fetchData() creates."
            )

            "Data received" in output.lines() -> hint(
                "Append \" - Processed\" to the builder before printing it. " +
                        "Inside the lambda you can call the append() function " +
                        "directly, because the StringBuilder is the receiver."
            )

            else -> hint(
                "Make the printed line exactly \"$expected\". Append " +
                        "\" - Processed\" to the builder and print it once."
            )
        }
    }
}
