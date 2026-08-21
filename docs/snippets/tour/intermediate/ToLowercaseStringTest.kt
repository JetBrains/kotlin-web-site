import kotlin.test.Test
import kotlin.test.assertEquals

class ToLowercaseStringTest {
    @Test
    fun testToLowercaseString() {
        assertEquals("hello world!", "Hello World!".toLowercaseString())
    }
}
