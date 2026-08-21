import kotlin.test.Test
import kotlin.test.assertTrue

class RandomEmployeeGeneratorTest {
    @Test
    fun testGenerateEmployee() {
        val empGen = RandomEmployeeGenerator(10, 30)
        repeat(20) {
            val emp = empGen.generateEmployee()
            assertTrue(emp.salary >= 10 && emp.salary < 30, "Salary out of range: ${emp.salary}")
            assertTrue(emp.name.isNotBlank())
        }
        empGen.minSalary = 50
        empGen.maxSalary = 100
        repeat(20) {
            val emp = empGen.generateEmployee()
            assertTrue(emp.salary >= 50 && emp.salary < 100, "Salary out of range: ${emp.salary}")
        }
    }
}
