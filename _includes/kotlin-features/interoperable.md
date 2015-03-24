### Interoperable

Create and consume Java code at will

``` kotlin
import io.netty.channel.ChannelInboundMessageHandlerAdapter
import io.netty.channel.ChannelHandlerContext

public class NettyHandler: ChannelInboundMessageHandlerAdapter<Any>() {
  public override fun messageReceived(p0: ChannelHandlerContext?, p1: Any?) {
    throw UnsupportedOperationException()
  }
}
```

Or use any existing library on the JVM, as there’s 100% compatibility, including SAM support.

Target either the JVM or JavaScript. Write code in Kotlin and decide where you want to deploy to

``` kotlin
import js.dom.html.*

fun onLoad() {
  window.document.body.innerHTML += "<br/>Hello, Kotlin!"
}
```