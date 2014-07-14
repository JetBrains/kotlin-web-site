---
layout: api
title: kotlin.concurrent
---
[stdlib](../index.md) / [kotlin.concurrent](index.md)

# kotlin.concurrent

```
package kotlin.concurrent
```

## Members

| Name | Summary |
|------|---------|
|[FunctionalList](FunctionalList/index.md)|&nbsp;&nbsp;**`abstract class FunctionalList<T> `**<br>|
|[FunctionalQueue](FunctionalQueue/index.md)|&nbsp;&nbsp;**`class FunctionalQueue<T> `**<br>|
|[alive](alive/index.md)|&nbsp;&nbsp;**`val Thread.alive: Boolean`**<br>|
|[contextClassLoader](contextClassLoader/index.md)|&nbsp;&nbsp;**`val Thread.contextClassLoader: ClassLoader`**<br>|
|[currentThread](currentThread/index.md)|&nbsp;&nbsp;**`val currentThread: Thread`**<br>|
|[daemon](daemon/index.md)|&nbsp;&nbsp;**`val Thread.daemon: Boolean`**<br>|
|[fixedRateTimer](fixedRateTimer.md)|&nbsp;&nbsp;**`public fun fixedRateTimer(name: String, daemon: Boolean, initialDelay: Long, period: Long, action: TimerTask.()->Unit): Timer`**<br>&nbsp;&nbsp;**`public fun fixedRateTimer(name: String, daemon: Boolean, startAt: Date, period: Long, action: TimerTask.()->Unit): Timer`**<br>|
|[invoke](invoke.md)|Allows you to use the executor as a function to<br>&nbsp;&nbsp;**`public fun <T> ExecutorService.invoke(action: ()->T): Future<T>`**<br>&nbsp;&nbsp;**`public fun Executor.invoke(action: ()->Unit): Unit`**<br>|
|[latch](latch.md)|Execute given calculation and await for CountDownLatch<br>&nbsp;&nbsp;**`fun <T> Int.latch(op: CountDownLatch.()->T): T`**<br>|
|[name](name/index.md)|&nbsp;&nbsp;**`val Thread.name: String`**<br>|
|[priority](priority/index.md)|&nbsp;&nbsp;**`val Thread.priority: Int`**<br>|
|[read](read.md)|Executes given calculation under read lock<br>&nbsp;&nbsp;**`public fun <T> ReentrantReadWriteLock.read(action: ()->T): T`**<br>|
|[schedule](schedule.md)|&nbsp;&nbsp;**`public fun Timer.schedule(delay: Long, period: Long, action: TimerTask.()->Unit): TimerTask`**<br>&nbsp;&nbsp;**`public fun Timer.schedule(delay: Long, action: TimerTask.()->Unit): TimerTask`**<br>&nbsp;&nbsp;**`public fun Timer.schedule(time: Date, action: TimerTask.()->Unit): TimerTask`**<br>&nbsp;&nbsp;**`public fun Timer.schedule(time: Date, period: Long, action: TimerTask.()->Unit): TimerTask`**<br>|
|[scheduleAtFixedRate](scheduleAtFixedRate.md)|&nbsp;&nbsp;**`public fun Timer.scheduleAtFixedRate(delay: Long, period: Long, action: TimerTask.()->Unit): TimerTask`**<br>&nbsp;&nbsp;**`public fun Timer.scheduleAtFixedRate(time: Date, period: Long, action: TimerTask.()->Unit): TimerTask`**<br>|
|[thread](thread.md)|&nbsp;&nbsp;**`public fun thread(start: Boolean, daemon: Boolean, contextClassLoader: ClassLoader, name: String, priority: Int, block: ()->Unit): Thread`**<br>|
|[timer](timer.md)|&nbsp;&nbsp;**`public fun timer(name: String, daemon: Boolean, initialDelay: Long, period: Long, action: TimerTask.()->Unit): Timer`**<br>&nbsp;&nbsp;**`public fun timer(name: String, daemon: Boolean, startAt: Date, period: Long, action: TimerTask.()->Unit): Timer`**<br>|
|[timerTask](timerTask.md)|&nbsp;&nbsp;**`public fun timerTask(action: TimerTask.()->Unit): TimerTask`**<br>|
|[withLock](withLock.md)|Executes given calculation under lock<br>&nbsp;&nbsp;**`public fun <T> Lock.withLock(action: ()->T): T`**<br>|
|[write](write.md)|Executes given calculation under write lock.<br>&nbsp;&nbsp;**`public fun <T> ReentrantReadWriteLock.write(action: ()->T): T`**<br>|
