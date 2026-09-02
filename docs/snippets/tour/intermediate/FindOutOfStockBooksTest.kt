import kotlin.test.Test

class FindOutOfStockBooksTest {
    private fun outOfStock(inventory: List<Int>): List<Int> =
        findOutOfStockBooks(inventory)

    private fun check(inventory: List<Int>, expected: List<Int>) =
        expect("findOutOfStockBooks(listOf(${inventory.joinToString()}))", expected) {
            outOfStock(inventory)
        }

    @Test
    fun `find the index of every out-of-stock book`() {
        val checks = listOf(
            check(listOf(9, 0, 0, 4), expected = listOf(1, 2)),
            check(listOf(6, 2, 9), expected = emptyList()),
            check(listOf(0, 4), expected = listOf(0)),
        )
        when (val failed = checks.firstMismatch()) {
            null -> passed(
                "Checked: findOutOfStockBooks() returns the indices of every " +
                        "book with quantity 0 for any inventory, and an empty " +
                        "list when everything is in stock."
            )

            else -> when {
                failed.thrown != null -> hint(
                    "Return the collected list of indices instead of throwing. " +
                            "Go through the inventory and collect every index " +
                            "whose quantity is 0.",
                    failed
                )

                failed.actual == listOf(0, 0) -> hint(
                    "Return the positions of the zero quantities, not the " +
                            "quantities themselves. For listOf(9, 0, 0, 4) the " +
                            "out-of-stock books are at indices 1 and 2.",
                    failed
                )

                failed.actual == listOf(2, 3) && failed.expected == listOf(1, 2) -> hint(
                    "Count indices from 0, not from 1. In Kotlin the first " +
                            "book in the list is at index 0.",
                    failed
                )

                failed.actual == listOf(0, 3) && failed.expected == listOf(1, 2) -> hint(
                    "Collect an index only when its quantity equals 0. Your " +
                            "code collects the books that are in stock instead.",
                    failed
                )

                else -> hint(
                    "Collect the index of every quantity that equals 0. The " +
                            "inventory's indices property from Hint 1 gives you " +
                            "the index range to check.",
                    failed
                )
            }
        }
    }
}
