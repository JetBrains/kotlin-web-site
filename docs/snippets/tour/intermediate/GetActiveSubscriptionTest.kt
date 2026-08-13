import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class GetActiveSubscriptionTest {
    @Test
    fun testGetActiveSubscription() {
        val userWithPremiumPlan = listOf(
            Subscription("Basic Plan", false),
            Subscription("Premium Plan", true)
        )
        val userWithConflictingPlans = listOf(
            Subscription("Basic Plan", true),
            Subscription("Premium Plan", true)
        )
        assertEquals(Subscription("Premium Plan", true), getActiveSubscription(userWithPremiumPlan))
        assertNull(getActiveSubscription(userWithConflictingPlans))
    }
}
