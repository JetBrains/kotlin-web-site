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
            budget.remainingBudget = 100
            budget.remainingBudget = 300
            budget.remainingBudget = 900
        } finally {
            System.setOut(originalOut)
        }
        return out.toString().trim().lines().filter { it.isNotEmpty() }
    }

    @Test
    fun `warn when the remaining budget is below 20% and report increases`() {
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
        val warnings = listOf(350, 100, 300).map {
            "Warning: Your remaining budget ($it) is below 20% of your total budget."
        }
        val goodNews = "Good news: Your remaining budget increased to 900."
        val warningLines = lines.filter { "below 20%" in it || it.startsWith("Warning") }
        val goodNewsLines = lines.filter { "increased" in it || it.startsWith("Good news") }
        val warningLike = warningLines.isNotEmpty()
        val goodNewsLike = goodNewsLines.isNotEmpty()
        val shown = lines.joinToString("\n")
        when {
            lines == warnings + goodNews -> passed(
                "remainingBudget prints a warning below 20% of totalBudget, " +
                        "even when the budget increases, reports other " +
                        "increases, and prints nothing for other changes.",
                showOutput = true
            )

            lines.isEmpty() -> hint(
                "Delegate remainingBudget to observable() and print the " +
                        "messages from its lambda function. Lowering a budget of 2000 to " +
                        "350 prints a warning, and raising it back to 900 " +
                        "prints a good news message.",
                ""
            )

            lines.any { "increased to 1200" in it } -> hint(
                "Initialize the observable property with totalBudget. The " +
                        "budget starts at the full amount, so lowering it to " +
                        "1200 is not an increase.",
                shown
            )

            goodNewsLike && warningLines.none { "350" in it } -> hint(
                "Calculate the threshold as 20% of the totalBudget property, " +
                        "not as a fixed number. For a budget of 2000, dropping to " +
                        "350 prints a warning.",
                shown
            )

            warningLike && !goodNewsLike -> hint(
                "Print the good news message when the new value is greater " +
                        "than the previous one. Raising 300 to 900 counts as " +
                        "an increase.",
                shown
            )

            goodNewsLines.any { "300" in it } -> hint(
                "Check the 20% threshold first, and print only the warning " +
                        "when the new value is below it. For a budget of 2000, " +
                        "raising 100 to 300 prints the warning, not good news.",
                shown
            )

            warningLines.none { "300" in it } -> hint(
                "Print the warning whenever the new value is below 20% of " +
                        "totalBudget, even if it's greater than the previous " +
                        "one. For a budget of 2000, raising 100 to 300 prints " +
                        "a warning.",
                shown
            )

            warningLines.any { it !in warnings } -> hint(
                "Print \"${warnings.first()}\" exactly. The warning keeps " +
                        "parentheses around the remaining value.",
                shown
            )

            goodNews !in lines && goodNewsLike -> hint(
                "Print \"$goodNews\" exactly. The message ends with the new " +
                        "remaining value and a period.",
                shown
            )

            lines.size > warnings.size + 1 -> hint(
                "Print only when the new value is below 20% of totalBudget or " +
                        "greater than the previous one. Lowering 2000 to 1200 " +
                        "prints nothing.",
                shown
            )

            else -> hint(
                "Print the warning below 20% of totalBudget and the good news message " +
                        "on an increase. Match the wording shown in the comments " +
                        "of main().",
                shown
            )
        }
    }
}
