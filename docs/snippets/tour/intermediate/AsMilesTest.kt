import kotlin.test.Test
import kotlin.test.assertEquals

class AsMilesTest {
    @Test
    fun testAsMiles() {
        assertEquals(3.106855, 5.0.asMiles, 0.0001)
        assertEquals(26.218757, 42.195.asMiles, 0.0001)
    }
}
