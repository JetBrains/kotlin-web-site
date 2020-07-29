expect class AtomicRef<V>(value: V) {
    fun get(): V
    fun set(value: V)
    fun getAndSet(value: V): V
    fun compareAndSet(expect: V, update: V): Boolean
}
​
actual typealias AtomicRef<V> = java.util.concurrent.atomic.AtomicReference<V>
