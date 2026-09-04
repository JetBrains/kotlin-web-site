import kotlin.test.Test

class PrintBuildInfoTest {
    @Test
    fun `print the build info`() {
        when (output) {
            "experimental build info" -> passed(
                "Checked: printBuildInfo() runs and prints the build info. The " +
                        "@OptIn annotation itself works at compile time only, so it " +
                        "cannot be verified here. Compare your annotation with the " +
                        "example solution."
            )

            "" -> hint(
                "Keep main() calling printBuildInfo(). The program prints " +
                        "\"experimental build info\".",
                ""
            )

            else -> hint(
                "Keep the given println inside printBuildInfo(). The program " +
                        "prints exactly \"experimental build info\"."
            )
        }
    }
}
