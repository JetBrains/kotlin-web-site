import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.floor
import kotlin.test.Test

// Calls the learner's function directly; .toDouble() keeps the test compiling
// whether circleArea returns a Double or an Int.
private fun area(radius: Int): Double = circleArea(radius).toDouble()

// The 1e-3 tolerance is tight enough to tell PI apart from a rounded 3.14
// already at radius 1 (the difference is about 0.0016).
private fun Double.isAbout(expected: Double): Boolean = abs(this - expected) < 1e-3

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CircleAreaTest {
    // Order matters: the success condition goes first, then the symptoms from
    // the most specific to the most general. The full-formula branches (3.14,
    // circumference, missing square) must come before the hardcoded-radius
    // branch, which would otherwise swallow them. A wrong signature (e.g.
    // radius: Double) fails to compile - the starter main() already calls
    // circleArea(2), so the compiler points the learner at the mismatch.
    // The main() output is irrelevant here, so the functional hints pass
    // shownOutput = "" and include the actual values in the text instead.
    @Test
    fun `circleArea returns the area for any radius`() = when {
        area(1).isAbout(PI) && area(2).isAbout(4 * PI) && area(5).isAbout(25 * PI) ->
            passed()

        listOf(1, 2, 5).all { area(it).isAbout(3.14 * it * it) } ->
            hint("Close! Use PI from kotlin.math instead of a rounded value like 3.14.", "")

        listOf(1, 2, 5).all { area(it).isAbout(2 * PI * it) } ->
            hint("That's the circumference (2 * PI * r). The area is PI * radius * radius.", "")

        listOf(1, 2, 5).all { area(it).isAbout(PI * it) } ->
            hint("Almost - don't forget to square the radius: PI * radius * radius.", "")

        area(2).isAbout(4 * PI) -> hint(
            "circleArea(2) is right, but circleArea(5) returned ${area(5)}. " +
                    "Use the radius parameter instead of a fixed number.",
            ""
        )

        listOf(1, 2, 5).all { area(it).isAbout(floor(PI * it * it)) } ->
            hint("The area is truncated to a whole number. Return the exact Double value.", "")

        else -> hint(
            "circleArea(5) returned ${area(5)}, but ${25 * PI} was expected. " +
                    "The formula is PI * radius * radius.",
            ""
        )
    }
}
