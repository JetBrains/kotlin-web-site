import kotlin.test.Test

class LazyHealthCheckTest {
    @Test
    fun `run only the health check that the program uses`() {
        val expectedLines = listOf(
            "Performing application server health check...",
            "Application server is online and healthy",
        )
        when {
            output.lines() == expectedLines -> passed(
                "Checked: main() prints both lines and the database check " +
                        "never runs. Lazy initialization skips it because its " +
                        "value is never needed."
            )

            "Performing database health check..." in output.lines() -> hint(
                "Initialize the checks with by lazy so each one only runs " +
                        "when its value is needed. Right now the database " +
                        "check runs even though the when never reaches it."
            )

            "Performing application server health check..." !in output.lines() -> hint(
                "Initialize isAppServerHealthy with a lazy block that calls " +
                        "checkAppServer(). Its message is the first printed " +
                        "line."
            )

            "Application server is online and healthy" !in output.lines() -> hint(
                "Keep the given when block as it is. checkAppServer() returns " +
                        "true, so main() prints \"Application server is " +
                        "online and healthy\"."
            )

            else -> hint(
                "Print nothing beyond the two lines shown in main()'s " +
                        "comments. The checks run only through the given when " +
                        "block."
            )
        }
    }
}
