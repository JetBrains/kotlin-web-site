---
layout: reference
title: "Enum Classes"
category: reference
subcategory: syntax
---


The most basic usage of enum classes is implementing type-safe enums

{% highlight kotlin %}
enum class Direction {
  NORTH
  SOUTH
  WEST
  EAST
}
{% endhighlight %}

Each enum constant is an object.

## Initialization

Since each enum is an instance of the enum class, they can be initialized

{% highlight kotlin %}
enum class Color(val rgb : Int) {
  RED : Color(0xFF0000)
  GREEN : Color(0x00FF00)
  BLUE : Color(0x0000FF)
}
{% endhighlight %}

## Anonymous classes

Enum constants can also declare their own anonymous classes

{% highlight kotlin %}
enum class ProtocolState {
  WAITING {
    override fun signal() = TALKING
  }

  TALKING {
    override fun signal() = WAITING
  }

  abstract fun signal() : ProtocolState
}
{% endhighlight %}

with their corresponding methods, as well as overriding base methods.
