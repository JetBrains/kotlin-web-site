### Why Kotlin? Because Kotlin is concise.

Create a POJO with getters, setters, `equals()`, `hashCode()`, `toString()` and `copy()` in a single line:

{% highlight kotlin %}
data class Customer(val name: String, val email: String, val company: String)
{% endhighlight %}

Or filter a list using a lambda expression:

{% highlight kotlin %}
val positiveNumbers = list.filter {it > 0}
{% endhighlight %}

Want a singleton? Create an object:

{% highlight kotlin %}
object ThisIsASingleton {
  val companyName: String = "JetBrains"
}
{% endhighlight %}