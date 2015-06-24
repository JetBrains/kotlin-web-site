import org.springframework.context.annotation.ComponentScan
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import kotlin.platform.platformStatic
import org.springframework.boot.SpringApplication

ComponentScan
EnableAutoConfiguration
public class Application {
    companion  object {
        platformStatic public fun main(args: Array<String>) {
            SpringApplication.run(javaClass<Application>(), *args)
        }
    }
}