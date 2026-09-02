import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test

class BudgetTest {
    private fun scenario(): List<String> {
        val budget = Budget(totalBudget = 2000)
        val out = ByteArrayOutputStream()
        val originalOut = System.out
        try {
            System.setOut(PrintStream(out))
            budget.remainingBudget = 1200
            budget.remainingBudget = 350
            budget.remainingBudget = 900
        } finally {
            System.setOut(originalOut)
        }
        return out.toString().trim().lines().filter { it.isNotEmpty() }
    }

    @Test
    fun `warn below 20% of the budget and report every increase`() {
        val lines = try {
            scenario()
        } catch (e: Throwable) {
            hint(
                "Make the observable's lambda only compare values and print " +
                        "messages. Assigning to remainingBudget throws " +
                        (e::class.simpleName ?: "an exception") + ".",
                ""
            )
        }
        val warning =
            "Warning: Your remaining budget (350) is below 20% of your total budget."
        val goodNews = "Good news: Your remaining budget increased to 900."
        val warningLike = lines.any { "below 20%" in it || it.startsWith("Warning") }
        val goodNewsLike = lines.any { "increased" in it || it.startsWith("Good news") }
        val shown = lines.joinToString("\n")
        when {
            lines == listOf(warning, goodNews) -> passed(
                "Checked: for a budget of any size, remainingBudget warns " +
                        "below 20% of the total, reports increases, and stays " +
                        "silent otherwise. Compare your delegate with the " +
                        "example solution."
            )

            lines.isEmpty() -> hint(
                "Delegate remainingBudget to observable() and print the " +
                        "messages from its lambda. Lowering a 2000 budget to " +
                        "350 prints a warning, and raising it back to 900 " +
                        "prints good news.",
                ""
            )

            lines.any { "increased to 1200" in it } -> hint(
                "Initialize the observable property with totalBudget. The " +
                        "budget starts at the full amount, so lowering it to " +
                        "1200 is not an increase.",
                shown
            )

            !warningLike && goodNewsLike -> hint(
                "Calculate the threshold as 20% of the totalBudget property, " +
                        "not as a fixed number. For a 2000 budget, dropping to " +
                        "350 prints the warning.",
                shown
            )

            warningLike && !goodNewsLike -> hint(
                "Print the good-news message when the new value is greater " +
                        "than the previous one. Raising 350 to 900 counts as " +
                        "an increase.",
                shown
            )

            warning !in lines && warningLike -> hint(
                "Match the warning wording shown in main()'s comments exactly. " +
                        "It keeps the parentheses around the value.",
                shown
            )

            goodNews !in lines && goodNewsLike -> hint(
                "Match the good-news wording shown in main()'s comments " +
                        "exactly. It ends with the new value and a period.",
                shown
            )

            lines.size > 2 -> hint(
                "Print only when the new value is below 20% of totalBudget or " +
                        "greater than the previous one. Lowering 2000 to 1200 " +
                        "prints nothing.",
                shown
            )

            else -> hint(
                "Print the warning below 20% of totalBudget and the good news " +
                        "on an increase. Match the wording shown in main()'s " +
                        "comments.",
                shown
            )
        }
    }
}
