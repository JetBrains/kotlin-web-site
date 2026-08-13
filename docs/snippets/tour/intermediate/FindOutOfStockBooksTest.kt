import kotlin.test.Test
import kotlin.test.assertEquals

class FindOutOfStockBooksTest {
    @Test
    fun testFindOutOfStockBooks() {
        assertEquals(listOf(1, 3), findOutOfStockBooks(listOf(3, 0, 7, 0, 5)))
        assertEquals(emptyList(), findOutOfStockBooks(listOf(1, 2, 3)))
        assertEquals(listOf(0), findOutOfStockBooks(listOf(0)))
    }
}
