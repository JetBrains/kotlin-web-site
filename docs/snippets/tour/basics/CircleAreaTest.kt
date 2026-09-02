import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.floor
import kotlin.test.Test

private fun areaOf(radius: Int): Double {
    val result: Any? = circleArea(radius)
    return (result as? Number)?.toDouble() ?: Double.NaN
}

private fun Double.isAbout(expected: Double): Boolean = abs(this - expected) < 1e-3

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CircleAreaTest {

    @Test
    fun `calculate the area for any radius`() = when {
        areaOf(1).isAbout(PI) && areaOf(2).isAbout(4 * PI) && areaOf(5).isAbout(25 * PI) ->
            passed()

        areaOf(2).isNaN() -> hint(
            "Return the area instead of printing it inside the function. " +
                    "main() prints the value that circleArea() returns.",
            ""
        )

        listOf(1, 2, 5).all { areaOf(it).isAbout(3.14 * it * it) } ->
            hint("Use PI from kotlin.math instead of a rounded value like 3.14. ", "")

        listOf(1, 2, 5).all { areaOf(it).isAbout(2 * PI * it) } ->
        hint(
            "Use the area formula: PI * radius * radius. " +
                    "2 * PI * radius calculates the circumference.",
            ""
        )

        listOf(1, 2, 5).all { areaOf(it).isAbout(PI * it) } ->
            hint("Square the radius: PI * radius * radius.", "")

        areaOf(2).isAbout(4 * PI) -> hint(
            "Use the radius parameter in the calculation. " +
                    "circleArea(2) returns the expected value, but circleArea(5) returns ${areaOf(5)}.",
            ""
        )

        listOf(1, 2, 5).all { areaOf(it).isAbout(floor(PI * it * it)) } ->
            hint("Return the exact Double value instead of truncating the area to a whole number.", "")

        else -> hint(
            "Check the formula: use PI * radius * radius. " +
                    "For a radius of 5, circleArea() returns ${areaOf(5)}, but ${25 * PI} is expected.",
            ""
        )
    }
}