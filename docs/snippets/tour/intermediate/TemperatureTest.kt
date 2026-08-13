import kotlin.test.Test
import kotlin.test.assertEquals

class TemperatureTest {
    @Test
    fun testFromFahrenheit() {
        val temp = Temperature.fromFahrenheit(90.0)
        assertEquals(32.22222222222222, temp.celsius, 0.0001)
    }
}
