import kotlin.test.Test

class GetActiveSubscriptionTest {
    private fun active(subscriptions: List<Subscription>): Any? =
        getActiveSubscription(subscriptions)

    @Test
    fun `find the single active subscription`() {
        val oneActive = listOf(
            Subscription("Free Plan", false),
            Subscription("Family Plan", true),
            Subscription("Student Plan", false),
        )
        val twoActive = listOf(
            Subscription("Family Plan", true),
            Subscription("Student Plan", true),
        )
        val noneActive = listOf(Subscription("Free Plan", false))

        val checks = listOf(
            expect(
                "getActiveSubscription() with one active subscription",
                Subscription("Family Plan", true),
            ) { active(oneActive) },
            expect(
                "getActiveSubscription() with two active subscriptions",
                null,
            ) { active(twoActive) },
            expect(
                "getActiveSubscription() with no active subscription",
                null,
            ) { active(noneActive) },
        )
        when (val failed = checks.firstMismatch()) {
            null -> passed(
                "Checked: getActiveSubscription() returns the single active " +
                        "subscription, and null when none or more than one is active."
            )

            else -> when {
                failed.thrown is NotImplementedError -> hint(
                    "Replace the TODO() with a call to singleOrNull() on the " +
                            "subscriptions list.",
                    failed
                )

                failed.thrown != null -> hint(
                    "Use singleOrNull() instead of single(). It returns null " +
                            "instead of throwing an exception when there is no " +
                            "single match.",
                    failed
                )

                "two active" in failed.call && failed.actual != null -> hint(
                    "Return null when more than one subscription is active. " +
                            "singleOrNull() does that, while firstOrNull() just " +
                            "picks the first match.",
                    failed
                )

                else -> hint(
                    "Pass a predicate to singleOrNull() that checks the " +
                            "subscription's isActive property.",
                    failed
                )
            }
        }
    }
}
