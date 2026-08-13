import kotlin.test.Test
import kotlin.test.assertEquals

class FlyingSkateboardTest {
    @Test
    fun testFlyingSkateboard() {
        assertEquals("Flying Skateboard", FlyingSkateboard.name)
        assertEquals("Glides through the air with a hover engine", FlyingSkateboard.move())
        assertEquals("Woooooooo", FlyingSkateboard.fly())
    }
}
