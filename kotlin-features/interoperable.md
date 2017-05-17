
### Interoperable

Use any existing library on the JVM, as there’s 100% compatibility, including SAM support.

``` kotlin
import io.reactivex.Flowable
import io.reactivex.schedulers.Schedulers

Flowable
    .fromCallable {
        Thread.sleep(1000) //  imitate expensive computation
        "Done"
    }
    .subscribeOn(Schedulers.io())
    .observeOn(Schedulers.single())
    .subscribe(::println, Throwable::printStackTrace)
```

Target either the JVM or JavaScript. Write code in Kotlin and decide where you want to deploy to

``` kotlin
import kotlin.browser.window

fun onLoad() {
    window.document.body!!.innerHTML += "<br/>Hello, Kotlin!"
}
```