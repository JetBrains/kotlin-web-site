import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestParam
import java.util.concurrent.atomic.AtomicLong
import org.springframework.web.bind.annotation.RequestMapping

RestController
public class GreetingController {

    val counter = AtomicLong()

    RequestMapping("/greeting")
    public fun greeting(RequestParam(value = "name", defaultValue = "World") name: String): Greeting {
        return Greeting(counter.incrementAndGet(), "Hello, $name")
    }
}