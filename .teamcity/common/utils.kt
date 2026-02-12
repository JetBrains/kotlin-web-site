package common

/**
 * Sanitizes a string to be used as a TeamCity ID.
 *
 * @param id The string to sanitize
 */
fun sanitizeId(id: String): String = id.replace("[^a-zA-Z0-9_]".toRegex(), "_")
