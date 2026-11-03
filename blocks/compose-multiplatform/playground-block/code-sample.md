import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.material.darkColors
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.ComposeViewport
import kotlinx.coroutines.delay
import kotlin.time.Clock
import kotlin.time.ExperimentalTime

//sampleStart
private val DarkClockColors = darkColors(
    background = Color(0xFF0F1115),
    surface = Color(0xFF1A1D24),
    primary = Color(0xFF6366F1), // Vibrant accent for the active number
    onPrimary = Color.White,
    onSurface = Color(0xFFE2E8F0) // Muted tone for inactive digits
)

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport {
        MaterialTheme(colors = DarkClockColors) {
            Surface(
                modifier = Modifier.fillMaxSize(),
                color = MaterialTheme.colors.background
            ) {
                ClockScreen()
            }
        }
    }
}

data class Time(val hours: Int, val minutes: Int, val seconds: Int)

@OptIn(ExperimentalTime::class)
@Composable
fun ClockScreen() {
    fun currentTime(): Time {
        val now = Clock.System.now()
        val epochSeconds = now.epochSeconds
        val secondsOfDay = (epochSeconds % 86400).toInt()

        val hours = (secondsOfDay / 3600) % 24
        val minutes = (secondsOfDay % 3600) / 60
        val seconds = secondsOfDay % 60

        return Time(
            hours = hours,
            minutes = minutes,
            seconds = seconds,
        )
    }

    var time by remember { mutableStateOf(currentTime()) }
    LaunchedEffect(Unit) {
        while (true) {
            time = currentTime()
            delay(1000)
        }
    }

    Clock(time)
}

@Composable
fun Clock(time: Time) {
    Row(
        modifier = Modifier.fillMaxSize(),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        val padding = Modifier.padding(horizontal = 4.dp)

        NumberColumn(time.hours / 10, 0..2, padding)
        NumberColumn(time.hours % 10, 0..9, padding)

        Spacer(Modifier.size(16.dp))

        NumberColumn(time.minutes / 10, 0..5, padding)
        NumberColumn(time.minutes % 10, 0..9, padding)

        Spacer(Modifier.size(16.dp))

        NumberColumn(time.seconds / 10, 0..5, padding)
        NumberColumn(time.seconds % 10, 0..9, padding)
    }
}

@Composable
fun NumberColumn(
    current: Int,
    range: IntRange,
    modifier: Modifier = Modifier,
) {
    val size = 40.dp
    val mid = (range.last - range.first) / 2f
    val reset = current == range.first

    val offset by animateDpAsState(
        targetValue = size * (mid - current),
        animationSpec = if (reset) {
            spring(
                dampingRatio = Spring.DampingRatioLowBouncy,
                stiffness = Spring.StiffnessLow,
            )
        } else {
            tween(
                durationMillis = 300,
                easing = LinearOutSlowInEasing,
            )
        }
    )

    Column(
        modifier
            .offset(y = offset)
            .clip(RoundedCornerShape(percent = 25))
    ) {
        range.forEach { num ->
            Number(num == current, num, Modifier.size(size))
        }
    }
}

@Composable
fun Number(active: Boolean, value: Int, modifier: Modifier = Modifier) {
    val backgroundColor by animateColorAsState(
        if (active) MaterialTheme.colors.primary else MaterialTheme.colors.surface
    )
    val textColor by animateColorAsState(
        if (active) MaterialTheme.colors.onPrimary else MaterialTheme.colors.onSurface.copy(alpha = 0.4f)
    )

    Box(
        modifier = modifier.background(backgroundColor),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = value.toString(),
            fontSize = 20.sp,
            color = textColor,
        )
    }
}
//sampleEnd