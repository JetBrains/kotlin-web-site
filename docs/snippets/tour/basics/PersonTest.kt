import kotlin.test.Test
import kotlin.test.assertEquals

class PersonTest {
    @Test
    fun testPersonGraph() {
        val person = Person(
            Name("John", "Smith"),
            Address("123 Fake Street", City("Springfield", "US")),
            ownsAPet = false
        )
        assertEquals("John", person.name.first)
        assertEquals("Smith", person.name.last)
        assertEquals("123 Fake Street", person.address.street)
        assertEquals("Springfield", person.address.city.name)
        assertEquals("US", person.address.city.countryCode)
        assertEquals(false, person.ownsAPet)
    }
}
