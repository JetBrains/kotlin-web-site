import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.ScrollbarStyle
import androidx.compose.foundation.VerticalScrollbar
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollbarAdapter
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.path
import androidx.compose.ui.input.pointer.PointerIcon
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.ComposeViewport
import kotlinx.coroutines.launch

//sampleStart
private const val CardAnimationDurationMillis = 450
private const val RowsPerPage = 4
private const val TotalCards = 240

private object DemoColors {
    val background = Color(0xFF1C1F1E)
    val text = Color(0xFFF4F2E9)
    val secondaryText = Color(0xFFB7BCB3)
}

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport {
        MaterialTheme(
            colorScheme = darkColorScheme(
                primary = DemoColors.secondaryText,
                onSurface = DemoColors.text,
                onSurfaceVariant = DemoColors.secondaryText,
            )
        ) {
            ColorCollectionDemo()
        }
    }
}


private data class ColorTile(
    val name: String,
    val description: String,
    val color: Color,
    val ink: Color,
)

private val colorTiles = listOf(
    ColorTile("Persimmon", "A little burst of energy", Color(0xFFF27456), Color(0xFF52271F)),
    ColorTile("Butter", "A softer kind of sunshine", Color(0xFFF2D880), Color(0xFF514621)),
    ColorTile("Periwinkle", "Somewhere in the clouds", Color(0xFFB7B9ED), Color(0xFF333557)),
    ColorTile("Matcha", "A moment to slow down", Color(0xFFB5CDAA), Color(0xFF344932)),
    ColorTile("Rosewater", "A touch of warmth", Color(0xFFEABFC1), Color(0xFF633C43)),
    ColorTile("Deep sea", "Room to take a breath", Color(0xFF427C80), Color(0xFFF1F1DF)),
    ColorTile("Midnight", "A little quiet after dark", Color(0xFF294653), Color(0xFFF1F1DF)),
    ColorTile("Apricot", "A golden afternoon", Color(0xFFF3B87F), Color(0xFF623D2B)),
    ColorTile("Blue hour", "The day settles in", Color(0xFF748BB7), Color(0xFFF7F4E8)),
    ColorTile("Lilac", "A little daydream", Color(0xFFD4BDDA), Color(0xFF523E59)),
    ColorTile("Moss", "A walk in the shade", Color(0xFF8BA27B), Color(0xFF253A2A)),
    ColorTile("Dark moss", "Deep in the forest", Color(0xFF4C6040), Color(0xFFF1F1DF)),
    ColorTile("Cerise", "For the playful days", Color(0xFFD98783), Color(0xFF592D31)),
    ColorTile("Sandstone", "Something to come back to", Color(0xFFDAC8AC), Color(0xFF514638)),
    ColorTile("Dark sandstone", "Warmth beneath the surface", Color(0xFF715C46), Color(0xFFF7F4E8)),
)

private val cardHeights = listOf(260, 200, 300, 230, 290, 210, 250, 280, 210, 270, 220, 250)

@Composable
private fun ColorCollectionDemo() {
    var shuffledTiles by remember { mutableStateOf(colorTiles) }
    var heightOffset by remember { mutableStateOf(0) }
    var paint by remember { mutableStateOf(DemoColors.background) }
    val gridState = rememberLazyListState()
    val background = animateColorAsState(
        paint,
        animationSpec = tween(CardAnimationDurationMillis),
    )
    val lightBackground by remember(background) { derivedStateOf { background.value.luminance() > 0.21f } }
    val foreground = if (lightBackground) DemoColors.background else DemoColors.text
    BoxWithConstraints(
        Modifier.fillMaxSize().drawBehind {
            val color = background.value
            drawRect(
                brush = Brush.verticalGradient(
                    0f to color,
                    0.3f to color,
                    1f to lerp(color, DemoColors.background, 0.5f),
                )
            )
        }
    ) {
        val compact = maxWidth < 600.dp
        val sidePadding = if (compact) 20.dp else 48.dp
        val gridWidth = minOf(maxWidth, 1440.dp) - sidePadding * 2
        val columnCount = ((gridWidth + 16.dp) / 206.dp).toInt().coerceAtLeast(1)
        val pageSize = RowsPerPage * columnCount
        LazyColumn(
            modifier = Modifier.widthIn(max = 1440.dp).fillMaxSize().align(Alignment.TopCenter),
            state = gridState,
            contentPadding = PaddingValues(start = sidePadding, end = sidePadding, bottom = 48.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
            item {
                CollectionHeader(
                    compact = compact,
                    foreground = foreground,
                    onShuffle = {
                        shuffledTiles = shuffledTiles.shuffled()
                        heightOffset = (heightOffset + 1) % RowsPerPage
                    },
                )
            }
            // Pages keep columns stable while allowing the collection to be composed lazily.
            items((TotalCards + pageSize - 1) / pageSize) { page ->
                ColorTilePage(
                    columnCount, page, shuffledTiles, heightOffset,
                    onPaint = { tile -> paint = lerp(paint, tile.color, 0.4f) },
                )
            }
        }
        VerticalScrollbar(
            adapter = rememberScrollbarAdapter(gridState),
            modifier = Modifier.align(Alignment.CenterEnd).fillMaxHeight()
                .padding(top = 8.dp, bottom = 8.dp, end = 4.dp)
                .background(foreground.copy(alpha = 0.06f), RoundedCornerShape(50)),
                    style = ScrollbarStyle(
                        minimalHeight = 36.dp,
                        thickness = 8.dp,
                        shape = RoundedCornerShape(50),
                        hoverDurationMillis = 150,
                        unhoverColor = foreground.copy(alpha = 0.3f),
                    hoverColor = foreground.copy(alpha = 0.6f),
                ),
            )
    }
}

@Composable
private fun CollectionHeader(
    compact: Boolean,
    foreground: Color,
    onShuffle: () -> Unit,
) {
    Column(Modifier.padding(top = 48.dp, bottom = 24.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            IconButton(onClick = onShuffle) {
                Icon(ShuffleIcon, contentDescription = "Shuffle colors", tint = foreground)
            }
        }
        Text(
            "A little color, a lot of joy.",
            modifier = Modifier.padding(top = 20.dp),
            color = foreground,
            fontSize = if (compact) 38.sp else 56.sp,
            lineHeight = if (compact) 44.sp else 62.sp,
            fontWeight = FontWeight.Medium,
            letterSpacing = (-1).sp,
    )
        Text(
            "Click colors to blend them into the background.",
            modifier = Modifier.padding(top = 16.dp),
            color = foreground.copy(alpha = 0.8f),
            fontSize = 15.sp,
            lineHeight = 23.sp,
        )
    }
}

@Composable
private fun ColorTilePage(
    columnCount: Int,
    page: Int,
    tiles: List<ColorTile>,
    heightOffset: Int,
    onPaint: (ColorTile) -> Unit,
) {
    val pageSize = RowsPerPage * columnCount
    // Each column uses the same heights in a different order, keeping page boundaries even.
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
        repeat(columnCount) { column ->
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            repeat(RowsPerPage) { row ->
                val position = row * columnCount + column
                val index = page * pageSize + position
                if (index < TotalCards) {
                    val tile = tiles[(row + column * 5 + page % colorTiles.size) % colorTiles.size]
                    val height = tileHeight(row, column, page, heightOffset)
                    ColorTileCard(
                        index, tile, height,
                        onClick = { onPaint(tile) },
                    )
                }
            }
        }
        }
    }
}

private fun tileHeight(row: Int, column: Int, page: Int, heightOffset: Int): Int {
    val group = page % (cardHeights.size / RowsPerPage)
    val heightIndex = group * RowsPerPage + (row + column + heightOffset) % RowsPerPage
    return cardHeights[heightIndex]
}

@Composable
private fun ColorTileCard(
    index: Int,
    tile: ColorTile,
    height: Int,
    onClick: () -> Unit,
) {
    val interactionSource = remember { MutableInteractionSource() }
    val hovered by interactionSource.collectIsHoveredAsState()
    val clickScale = remember { Animatable(1f) }
    val scope = rememberCoroutineScope()
    val hex = remember(tile.color) {
        (tile.color.toArgb() and 0xFFFFFF).toString(16).uppercase().padStart(6, '0')
    }
    val scale by animateFloatAsState(
    if (hovered) 1.025f else 1f,
        animationSpec = tween(180),
)
    val artHover by animateFloatAsState(if (hovered) 1f else 0f, animationSpec = tween(260))
    val elevation by animateDpAsState(if (hovered) 10.dp else 0.dp, animationSpec = tween(180))
    val cardShape = remember { RoundedCornerShape(20.dp) }
    val animatedHeight by animateDpAsState(
        height.dp,
        animationSpec = tween(CardAnimationDurationMillis)
    )
    val animatedColor by animateColorAsState(
        tile.color,
        animationSpec = tween(CardAnimationDurationMillis)
    )
    val animatedInk by animateColorAsState(
        tile.ink,
        animationSpec = tween(CardAnimationDurationMillis)
    )
    Box(
        Modifier.fillMaxWidth().height(animatedHeight)
            .graphicsLayer {
        scaleX = scale * clickScale.value
        scaleY = scale * clickScale.value
        shadowElevation = elevation.toPx()
        shape = cardShape
    }
        .clip(cardShape).background(animatedColor)
        .pointerHoverIcon(PointerIcon.Hand)
        .clickable(
            interactionSource = interactionSource,
            indication = null,
            role = Role.Button,
            onClickLabel = "Add ${tile.name} to the background",
            onClick = {
                onClick()
                scope.launch {
                    clickScale.animateTo(0.95f, tween(80))
                    clickScale.animateTo(1f, spring(dampingRatio = 0.65f, stiffness = 500f))
                }
            },
        )
    ) {
        Canvas(Modifier.fillMaxSize()) { drawColorMotif(index, animatedInk, artHover) }
        Text(
            (index + 1).toString().padStart(2, '0'),
            modifier = Modifier.align(Alignment.TopStart).padding(20.dp),
            color = animatedInk.copy(alpha = 0.65f),
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            letterSpacing = 1.sp,
        )
        Column(Modifier.align(Alignment.BottomStart).padding(20.dp)) {
            Text(tile.name, color = animatedInk, fontSize = 22.sp, fontWeight = FontWeight.SemiBold)
            Text(tile.description, color = animatedInk.copy(alpha = 0.75f), fontSize = 12.sp)
            Text(
                "#$hex",
                modifier = Modifier.padding(top = 8.dp),
                color = animatedInk.copy(alpha = 0.75f),
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                letterSpacing = 1.sp,
            )
        }
    }
}

private fun DrawScope.drawColorMotif(index: Int, ink: Color, hover: Float) {
    val accent = ink.copy(alpha = 0.12f)
    val cycle = index / colorTiles.size
    val center = when ((index % 5 + cycle % 5) % 5) {
        0 -> Offset(size.width * 0.72f, size.height * 0.3f)
        1 -> Offset(size.width * 0.35f, size.height * 0.4f)
        2 -> Offset(size.width * 0.78f, size.height * 0.6f)
        3 -> Offset(size.width * 0.5f, size.height * 0.3f)
        else -> Offset(size.width * 0.52f, size.height * 0.55f)
    }
    val radius = size.width * 0.32f * (1f + 0.08f * hover)
    when ((index % 6 + cycle % 6) % 6) {
        0 -> {
            drawCircle(accent, radius, center)
            drawCircle(
                ink.copy(alpha = 0.1f),
                radius * 0.65f,
                center,
                style = Stroke(2.dp.toPx()),
            )
        }

        1 -> {
            rotate(degrees = 25f, pivot = center) {
                drawCenteredSquare(accent, center, radius * 0.7f)
                drawCenteredSquare(accent, center, radius, outlined = true)
            }
        }

        2 -> {
            val triangle = Path().apply {
                moveTo(center.x, center.y - radius)
                lineTo(center.x + radius, center.y + radius * 0.7f)
                lineTo(center.x - radius, center.y + radius * 0.7f)
                close()
            }
            drawPath(triangle, accent)
            drawLine(
                accent,
                Offset(center.x - radius * 0.6f, center.y + radius),
                Offset(center.x + radius * 0.6f, center.y + radius),
                strokeWidth = 2.dp.toPx(),
            )
        }

        3 -> {
            repeat(5) { line ->
                val offset = (line - 2) * radius * 0.35f
                drawLine(
                    accent,
                    Offset(center.x - radius * 0.7f + offset, center.y + radius * 0.7f),
                    Offset(center.x + radius * 0.7f + offset, center.y - radius * 0.7f),
                    strokeWidth = 5.dp.toPx(),
                )
            }
        }

        4 -> {
            val diamond = Path().apply {
                moveTo(center.x, center.y - radius)
                lineTo(center.x + radius, center.y)
                lineTo(center.x, center.y + radius)
                lineTo(center.x - radius, center.y)
                close()
            }
            drawPath(diamond, accent, style = Stroke(2.dp.toPx()))
            rotate(degrees = 45f, pivot = center) {
                drawCenteredSquare(accent, center, radius * 0.35f)
            }
        }

    else -> {
            drawCircle(accent, radius, center, style = Stroke(2.dp.toPx()))
            drawCircle(accent, radius * 0.72f, center, style = Stroke(2.dp.toPx()))
            drawCircle(accent, radius * 0.44f, center)
        }
    }
}

private fun DrawScope.drawCenteredSquare(
    color: Color,
    center: Offset,
    halfSize: Float,
    outlined: Boolean = false
) {
    drawRect(
        color,
        topLeft = Offset(center.x - halfSize, center.y - halfSize),
        size = Size(halfSize * 2, halfSize * 2),
        style = if (outlined) Stroke(2.dp.toPx()) else Fill,
    )
}

private val ShuffleIcon = ImageVector.Builder("Shuffle", 24.dp, 24.dp, 24f, 24f).path(
    stroke = SolidColor(Color.Black),
    strokeLineWidth = 2f,
    strokeLineCap = StrokeCap.Round,
    strokeLineJoin = StrokeJoin.Round,
) {
    moveTo(20f, 12f)
    curveTo(20f, 16.4f, 16.4f, 20f, 12f, 20f)
    curveTo(7.6f, 20f, 4f, 16.4f, 4f, 12f)
    curveTo(4f, 7.6f, 7.6f, 4f, 12f, 4f)
    curveTo(14.4f, 4f, 16.6f, 5.1f, 18f, 7f)
    moveTo(18f, 4f)
    lineTo(18f, 7f)
    lineTo(15f, 7f)
}.build()
//sampleEnd