import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class AudioTest {
    @Test
    fun testAudio() {
        val audio = Audio("Symphony No. 5", "Beethoven")
        assertTrue(audio is Media)
        assertEquals("Symphony No. 5", audio.title)

        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        audio.play()
        assertEquals("Playing audio: Symphony No. 5, composed by Beethoven", out.toString().trim())
    }
}
