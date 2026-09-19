import kotlin.test.Test

class IncrementedTest {
    private fun incrementedOf(list: List<Int>, expected: List<Int>) =
        expect("listOf(${list.joinToString()}).incremented()", expected) {
            list.incremented()
        }

    @Test
    fun `increment every element of a list by 1`() {
        val checks = listOf(
            incrementedOf(listOf(1, 2, 3), expected = listOf(2, 3, 4)),
            incrementedOf(listOf(4, 7), expected = listOf(5, 8)),
            incrementedOf(listOf(), expected = listOf()),
        )
        when (val failed = checks.firstMismatch()) {
            null ->
                if ("[2, 3, 4]" in output.lines()) passed(
                    "Checked: incremented() returns a new list where every " +
                            "element is 1 bigger than in the original list. " +
                            "Whether it is built with the buildList skeleton is " +
                            "not checked. Compare with the example solution."
                ) else hint(
                    "Keep the println(newList) call in main() as it is. It " +
                            "prints [2, 3, 4]."
                )

            else -> when {
                failed.thrown != null -> hint(
                    "Add the incremented elements to the new list inside " +
                            "buildList. It works for any list of integers.",
                    failed
                )

                failed.actual == listOf<Int>() -> hint(
                    "Add one element to the new list for every element of " +
                            "originalList. Inside buildList you can call the " +
                            "add() function directly, because the new list is " +
                            "the receiver.",
                    failed
                )

                failed.actual == listOf(1, 2, 3) || failed.actual == listOf(4, 7) -> hint(
                    "Increment each element by 1 before adding it to the new " +
                            "list.",
                    failed
                )

                else -> hint(
                    "Add each element of originalList plus 1 to the new list, " +
                            "keeping the original order.",
                    failed
                )
            }
        }
    }
}
