import kotlin.test.Test

class MeasureTimeTest {
    private val durationLike =
        Regex("""\d+(\.\d+)?(ns|us|ms|s|m|h|d)( \d+(\.\d+)?(ns|us|ms|s|m|h|d))*""")

    @Test
    fun `print the processed data and how long it takes`() {
        val lines = output.lines()
        val timeLine = lines.lastOrNull() ?: ""
        val timeValue = timeLine.removePrefix("Time taken: ").trim()
        when {
            lines.size == 2 && lines[0] == "Processed data" &&
                    timeLine.startsWith("Time taken: ") &&
                    durationLike.matches(timeValue) -> passed(
                "Checked: main() prints \"Processed data\" and the measured time. " +
                        "The exact duration changes from run to run, so only its " +
                        "format is checked."
            )

            output.isEmpty() -> hint(
                "Run the data processing inside the measureTime function from " +
                        "the kotlin.time package and assign its result to timeTaken.",
                ""
            )

            "->" in timeLine || "Function" in timeLine || "Lambda" in timeLine -> hint(
                "Put measureTime in front of the block so the block actually " +
                        "runs. Import it from the kotlin.time package.",
                timeLine
            )

            lines.none { it == "Processed data" } -> hint(
                "Keep the given println(\"Processed data\") inside the measured " +
                        "block."
            )

            lines.none { it.startsWith("Time taken: ") } -> hint(
                "Keep the given println with the time taken. It prints the " +
                        "duration that measureTime returns."
            )

            Regex("""\d+""").matches(timeValue) -> hint(
                "Use measureTime from the kotlin.time package. It returns a " +
                        "Duration that prints with a time unit, not a plain number.",
                timeLine
            )

            lines.size != 2 -> hint(
                "Print exactly two lines. The processed-data message comes " +
                        "first and the time taken after it."
            )

            else -> hint(
                "Assign the result of measureTime to timeTaken. The processing " +
                        "code goes inside the block that measureTime runs.",
                timeLine
            )
        }
    }
}
