import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class BudgetTest {
    @Test
    fun testObservableBudget() {
        val myBudget = Budget(totalBudget = 1000)
        myBudget.remainingBudget = 800
        assertEquals(800, myBudget.remainingBudget)

        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))

        myBudget.remainingBudget = 150
        myBudget.remainingBudget = 50
        myBudget.remainingBudget = 300

        val expected = listOf(
            "Warning: Your remaining budget (150) is below 20% of your total budget.",
            "Warning: Your remaining budget (50) is below 20% of your total budget.",
            "Good news: Your remaining budget increased to 300."
        )
        assertEquals(expected.joinToString("\n"), out.toString().trim())
    }
}
