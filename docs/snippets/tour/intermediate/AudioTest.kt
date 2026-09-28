import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test

class AudioTest {
    private fun audioOf(title: String, composer: String): Any = Audio(title, composer)

    private fun mediaMember(name: String) =
        Media::class.java.methods.firstOrNull { it.name == name }

    @Test
    fun `play audio using its own title and composer`() {
        val titleGetter = mediaMember("getTitle") ?: hint(
            if (mediaMember("play") == null)
                "Declare the title property and the play() function in the " +
                        "Media interface."
            else
                "Declare a title property in the Media interface: val title: String.",
            ""
        )
        val play = mediaMember("play") ?: hint(
            "Declare a play() function in the Media interface.",
            ""
        )
        val audio = try {
            audioOf("Nocturne", "Chopin")
        } catch (e: Throwable) {
            hint(
                "Make Audio creatable the way main() creates it. " +
                        "Audio(\"Nocturne\", \"Chopin\") throws ${e::class.simpleName}.",
                ""
            )
        }
        if (audio !is Media) hint(
            "Make Audio implement your Media interface. Add : Media to the " +
                    "class header and override the interface's members.",
            ""
        )
        val titleCheck = expect("Audio(\"Nocturne\", \"Chopin\").title", "Nocturne") {
            titleGetter.invoke(audio)
        }
        val captured = ByteArrayOutputStream()
        val originalOut = System.out
        val played = try {
            System.setOut(PrintStream(captured))
            play.invoke(audio)
            captured.toString().trim()
        } catch (e: Throwable) {
            hint(
                "Make play() print \"Playing audio: Nocturne, composed by Chopin\" " +
                        "without throwing ${(e.cause ?: e)::class.simpleName}.",
                ""
            )
        } finally {
            System.setOut(originalOut)
        }
        when {
            !titleCheck.isCorrect -> hint(
                "Define Audio's title property so Audio(\"Nocturne\", \"Chopin\").title " +
                        "returns \"Nocturne\".",
                titleCheck
            )

            played.isEmpty() -> hint(
                "Print \"Playing audio: Nocturne, composed by Chopin\" from play() " +
                        "with println().",
                ""
            )

            "Symphony No. 5" in played || "Beethoven" in played -> hint(
                "Build the message from the title and composer properties instead " +
                        "of fixed text. This audio is Nocturne, composed by Chopin.",
                played
            )

            played != "Playing audio: Nocturne, composed by Chopin" -> hint(
                "Make play() print \"Playing audio: \$title, composed by " +
                        "\$composer\". For this audio that is \"Playing audio: " +
                        "Nocturne, composed by Chopin\".",
                played
            )

            "Playing audio: Symphony No. 5, composed by Beethoven" !in output.lines() -> hint(
                "Keep the code in main() as it is. It prints " +
                        "\"Playing audio: Symphony No. 5, composed by Beethoven\"."
            )

            else -> passed(
                "Audio implements Media. Its title property returns the audio's " +
                        "title, and play() prints a message using the audio's title " +
                        "and composer. The test doesn't check whether you override " +
                        "title in Audio's constructor."
            )
        }
    }
}
