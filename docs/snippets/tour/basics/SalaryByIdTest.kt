import kotlin.test.Test
import kotlin.test.assertEquals

class SalaryByIdTest {
    @Test
    fun testSalaryById() {
        assertEquals(20, salaryById(1))
        assertEquals(0, salaryById(2))
        assertEquals(21, salaryById(3))
        assertEquals(23, salaryById(4))
        assertEquals(0, salaryById(5))
    }
}
