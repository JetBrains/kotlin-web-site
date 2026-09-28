import kotlin.test.Test

class PrintBuildInfoTest {
    @Test
    fun `printBuildInfo prints experimental build info`() {
        when (output) {
            "experimental build info" -> passed(
                "printBuildInfo() prints \"experimental build info\"."
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
