import kotlin.test.Test
import kotlin.test.assertEquals

class EmployeeTest {
    @Test
    fun testEmployee() {
        val emp = Employee("Mary", 20)
        assertEquals("Mary", emp.name)
        assertEquals(20, emp.salary)
        emp.salary += 10
        assertEquals(30, emp.salary)
        assertEquals(Employee("Mary", 30), emp)
    }
}
