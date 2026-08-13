import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class SmartDeviceTest {
    @Test
    fun testSmartDevices() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))

        val livingRoomLight = SmartLight("Living Room Light")
        val bedroomThermostat = SmartThermostat("Bedroom Thermostat")

        livingRoomLight.turnOn()
        livingRoomLight.adjustBrightness(10)
        livingRoomLight.turnOff()
        bedroomThermostat.turnOn()
        bedroomThermostat.adjustTemperature(5)
        bedroomThermostat.turnOff()

        val expected = listOf(
            "Living Room Light is now ON.",
            "Adjusting Living Room Light brightness to 10%.",
            "Living Room Light is now OFF.",
            "Bedroom Thermostat thermostat is now heating.",
            "Bedroom Thermostat thermostat set to 5°C.",
            "Bedroom Thermostat thermostat is now off."
        )
        assertEquals(expected.joinToString("\n"), out.toString().trim())
    }
}
