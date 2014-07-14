---
layout: api
title: kotlin.io
---
[stdlib](../index.md) / [kotlin.io](index.md)

# kotlin.io

```
package kotlin.io
```

## Members

| Name | Summary |
|------|---------|
|[LinesStream](LinesStream/index.md)|&nbsp;&nbsp;**`class LinesStream`**<br>|
|[appendBytes](appendBytes.md)|Appends bytes to the contents of the file.<br>&nbsp;&nbsp;**`public fun File.appendBytes(data: ByteArray): Unit`**<br>|
|[appendText](appendText.md)|Appends text to the contents of the file using a given character encoding.<br>&nbsp;&nbsp;**`public fun File.appendText(text: String, encoding: Charset): Unit`**<br><br>Appends text to the contents of the file using a character encoding.<br>&nbsp;&nbsp;**`public fun File.appendText(text: String, encoding: String): Unit`**<br>|
|[buffered](buffered.md)|Creates a buffered writer, or returns self if Writer is already buffered<br>&nbsp;&nbsp;**`public fun Writer.buffered(bufferSize: Int): BufferedWriter`**<br><br>Creates a buffered reader, or returns self if Reader is already buffered<br>&nbsp;&nbsp;**`public fun Reader.buffered(bufferSize: Int): BufferedReader`**<br><br>Creates a buffered output stream<br>&nbsp;&nbsp;**`public fun OutputStream.buffered(bufferSize: Int): BufferedOutputStream`**<br><br>Creates a buffered input stream<br>&nbsp;&nbsp;**`public fun InputStream.buffered(bufferSize: Int): InputStream`**<br>|
|[canonicalPath](canonicalPath/index.md)|Returns the canonical path of the file<br>&nbsp;&nbsp;**`val File.canonicalPath: String`**<br>|
|[copyTo](copyTo.md)|Copies this file to the given output file, returning the number of bytes copied<br>&nbsp;&nbsp;**`public fun File.copyTo(file: File, bufferSize: Int): Long`**<br><br>Copies this reader to the given output writer, returning the number of bytes copied.<br>&nbsp;&nbsp;**`public fun Reader.copyTo(out: Writer, bufferSize: Int): Long`**<br><br>Copies this stream to the given output stream, returning the number of bytes copied<br>&nbsp;&nbsp;**`public fun InputStream.copyTo(out: OutputStream, bufferSize: Int): Long`**<br>|
|[defaultBufferSize](defaultBufferSize.md)|Returns the default buffer size when working with buffered streams<br>&nbsp;&nbsp;**`public val defaultBufferSize: Int`**<br>|
|[defaultCharset](defaultCharset.md)|Returns the default [[Charset]] which defaults to UTF-8<br>&nbsp;&nbsp;**`public val defaultCharset: Charset`**<br>|
|[directory](directory/index.md)|Returns this if the file is a directory or the parent if its a file inside a directory<br>&nbsp;&nbsp;**`val File.directory: File`**<br>|
|[extension](extension/index.md)|Returns true if the file ends with the given extension<br>&nbsp;&nbsp;**`val File.extension: String`**<br>|
|[forEachBlock](forEachBlock.md)|Reads file by byte blocks and calls closure for each block read. Block size depends on implementation but never less than 512.<br>&nbsp;&nbsp;**`fun File.forEachBlock(closure: (ByteArray, Int)->Unit): Unit`**<br>|
|[forEachLine](forEachLine.md)|Reads file line by line. Default charset is UTF-8.<br>&nbsp;&nbsp;**`fun File.forEachLine(charset: String, closure: (String)->Unit): Unit`**<br><br>Iterates through each line of this reader then closing the [[Reader]] when its completed<br>&nbsp;&nbsp;**`public fun Reader.forEachLine(block: (String)->Unit): Unit`**<br>|
|[isDescendant](isDescendant.md)|Returns true if the given file is in the same directory or a descendant directory<br>&nbsp;&nbsp;**`public fun File.isDescendant(file: File): Boolean`**<br>|
|[iterator](iterator.md)|Returns an [Iterator] of bytes over an input stream<br>&nbsp;&nbsp;**`public fun InputStream.iterator(): ByteIterator`**<br>|
|[lineIterator](lineIterator.md)|&nbsp;&nbsp;**`public fun BufferedReader.lineIterator(): Iterator<String>`**<br>|
|[lines](lines.md)|Returns an iterator over each line.<br>&nbsp;&nbsp;**`public fun BufferedReader.lines(): Stream<String>`**<br>|
|[listFiles](listFiles.md)|Returns an array of files and directories in the directory that satisfy the specified filter.<br>&nbsp;&nbsp;**`fun File.listFiles(filter: (File)->Boolean): Array<File>`**<br>|
|[name](name/index.md)|Returns the file name or "" for an empty name<br>&nbsp;&nbsp;**`val File.name: String`**<br>|
|[path](path/index.md)|Returns the file path or "" for an empty name<br>&nbsp;&nbsp;**`val File.path: String`**<br>|
|[print](print.md)|Prints the given message to [[System.out]]<br>&nbsp;&nbsp;**`public fun print(message: Byte): Unit`**<br>&nbsp;&nbsp;**`public fun print(message: Boolean): Unit`**<br>&nbsp;&nbsp;**`public fun print(message: Short): Unit`**<br>&nbsp;&nbsp;**`public fun print(message: Float): Unit`**<br>&nbsp;&nbsp;**`public fun print(message: Double): Unit`**<br>&nbsp;&nbsp;**`public fun print(message: CharArray): Unit`**<br>&nbsp;&nbsp;**`public fun print(message: Long): Unit`**<br>&nbsp;&nbsp;**`public fun print(message: Char): Unit`**<br>&nbsp;&nbsp;**`public fun print(message: Int): Unit`**<br>&nbsp;&nbsp;**`public fun print(message: Any): Unit`**<br>|
|[println](println.md)|Prints the given message and newline to [[System.out]]<br>&nbsp;&nbsp;**`public fun println(message: Short): Unit`**<br>&nbsp;&nbsp;**`public fun println(message: Byte): Unit`**<br>&nbsp;&nbsp;**`public fun println(message: Double): Unit`**<br>&nbsp;&nbsp;**`public fun println(message: Char): Unit`**<br>&nbsp;&nbsp;**`public fun println(message: Long): Unit`**<br>&nbsp;&nbsp;**`public fun println(message: CharArray): Unit`**<br>&nbsp;&nbsp;**`public fun println(message: Any): Unit`**<br>&nbsp;&nbsp;**`public fun println(message: Boolean): Unit`**<br>&nbsp;&nbsp;**`public fun println(message: Float): Unit`**<br>&nbsp;&nbsp;**`public fun println(message: Int): Unit`**<br><br>Prints a newline t[[System.out]]<br>&nbsp;&nbsp;**`public fun println(): Unit`**<br>|
|[readBytes](readBytes.md)|Reads the entire content of the URL as bytes<br>&nbsp;&nbsp;**`public fun URL.readBytes(): ByteArray`**<br><br>Reads the entire content of the file as bytes<br>&nbsp;&nbsp;**`public fun File.readBytes(): ByteArray`**<br><br>Reads this stream completely into a byte array<br>&nbsp;&nbsp;**`public fun InputStream.readBytes(estimatedSize: Int): ByteArray`**<br>|
|[readLine](readLine.md)|Reads a line of input from [[System.in]]<br>&nbsp;&nbsp;**`public fun readLine(): String`**<br>|
|[readLines](readLines.md)|Reads file content as strings list. By default uses UTF-8 charset.<br>&nbsp;&nbsp;**`fun File.readLines(charset: String): List<String>`**<br>|
|[readText](readText.md)|Reads the entire content of the file as a String using a character encoding.<br>&nbsp;&nbsp;**`public fun File.readText(encoding: Charset): String`**<br><br>Reads the entire content of the URL as a String with the specified character encoding.<br>&nbsp;&nbsp;**`public fun URL.readText(encoding: Charset): String`**<br><br>Reads this reader completely as a String<br>&nbsp;&nbsp;**`public fun Reader.readText(): String`**<br><br>Reads the entire content of the file as a String using the a character encoding.<br>&nbsp;&nbsp;**`public fun File.readText(encoding: String): String`**<br><br>Reads the entire content of the URL as a String with a character set name<br>&nbsp;&nbsp;**`public fun URL.readText(encoding: String): String`**<br>|
|[reader](reader.md)|Creates a reader on an input stream with specified *encoding*<br>&nbsp;&nbsp;**`public fun InputStream.reader(encoding: Charset): InputStreamReader`**<br>&nbsp;&nbsp;**`public fun InputStream.reader(encoding: String): InputStreamReader`**<br>&nbsp;&nbsp;**`public fun InputStream.reader(encoding: CharsetDecoder): InputStreamReader`**<br><br>Creates a new [[FileReader]] for this file<br>&nbsp;&nbsp;**`public fun File.reader(): FileReader`**<br>|
|[recurse](recurse.md)|Recursively process this file and all children with the given block<br>&nbsp;&nbsp;**`public fun File.recurse(block: (File)->Unit): Unit`**<br>|
|[relativePath](relativePath.md)|Returns the relative path of the given descendant of this file if its a descendant<br>&nbsp;&nbsp;**`public fun File.relativePath(descendant: File): String`**<br>|
|[stdin](stdin.md)|&nbsp;&nbsp;**`private val stdin: BufferedReader`**<br>|
|[useLines](useLines.md)|&nbsp;&nbsp;**`public fun <T> Reader.useLines(block: (Stream<String>)->T): T`**<br>|
|[writeBytes](writeBytes.md)|Writes the bytes as the contents of the file<br>&nbsp;&nbsp;**`public fun File.writeBytes(data: ByteArray): Unit`**<br>|
|[writeText](writeText.md)|Writes the text as the contents of the file using a character encoding.<br>&nbsp;&nbsp;**`public fun File.writeText(text: String, encoding: Charset): Unit`**<br><br>Writes the text as the contents of the file using the a<br>&nbsp;&nbsp;**`public fun File.writeText(text: String, encoding: String): Unit`**<br>|
|[writer](writer.md)|Creates a writer on an output stream with specified *encoding*<br>&nbsp;&nbsp;**`public fun OutputStream.writer(encoding: Charset): OutputStreamWriter`**<br>&nbsp;&nbsp;**`public fun OutputStream.writer(encoding: CharsetEncoder): OutputStreamWriter`**<br>&nbsp;&nbsp;**`public fun OutputStream.writer(encoding: String): OutputStreamWriter`**<br>|
