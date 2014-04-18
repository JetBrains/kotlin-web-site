### Safe

Get rid of those pesky NullPointerExceptions, you know, The Billion Dollar Mistake

{% highlight kotlin %}
var output : String
output = null
{% endhighlight %}

And of course, Kotlin protects you from mistakenly operating on nullable types,
including those from Java

{% highlight kotlin %}
println(output.length())
{% endhighlight %}

And if you check a type is right, the compiler will auto-cast it for you

{% highlight kotlin %}
fun calculateTotal(obj: Any) {
  if (obj in Invoice) {
    obj.calculateTotal()
  }
}
{% endhighlight %}