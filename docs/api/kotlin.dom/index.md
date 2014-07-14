---
layout: api
title: kotlin.dom
---
[stdlib](../index.md) / [kotlin.dom](index.md)

# kotlin.dom

```
package kotlin.dom
```

## Members

| Name | Summary |
|------|---------|
|[CloseableEventListener](CloseableEventListener/index.md)|&nbsp;&nbsp;**`private class CloseableEventListener`**<br>|
|[ElementListAsList](ElementListAsList/index.md)|&nbsp;&nbsp;**`class ElementListAsList`**<br>|
|[EventListenerHandler](EventListenerHandler/index.md)|&nbsp;&nbsp;**`private class EventListenerHandler`**<br>|
|[NextSiblings](NextSiblings/index.md)|&nbsp;&nbsp;**`class NextSiblings`**<br>|
|[NodeListAsList](NodeListAsList/index.md)|TODO this approach generates compiler errors...<br>&nbsp;&nbsp;**`class NodeListAsList`**<br>|
|[PreviousSiblings](PreviousSiblings/index.md)|&nbsp;&nbsp;**`class PreviousSiblings`**<br>|
|[addClass](addClass.md)|Adds the given CSS class to this element's 'class' attribute<br>&nbsp;&nbsp;**`fun Element.addClass(cssClass: String): Boolean`**<br>|
|[addElement](addElement.md)|Adds a newly created element which can be configured via a function<br>&nbsp;&nbsp;**`fun Document.addElement(name: String, init: Element.()->Unit): Element`**<br><br>Adds a newly created element to an element which has an owner Document which can be configured via a function<br>&nbsp;&nbsp;**`fun Element.addElement(name: String, doc: Document, init: Element.()->Unit): Element`**<br>|
|[addText](addText.md)|Adds a newly created text node to an element which either already has an owner Document or one must be provided as a parameter<br>&nbsp;&nbsp;**`fun Element.addText(text: String, doc: Document): Element`**<br>|
|[altKey](altKey/index.md)|&nbsp;&nbsp;**`val MouseEvent.altKey: Boolean`**<br>|
|[attribute](attribute.md)|Returns the attribute value or empty string if its not present<br>&nbsp;&nbsp;**`fun Element.attribute(name: String): String`**<br>|
|[attributes](attributes/index.md)|&nbsp;&nbsp;**`val Node.attributes: NamedNodeMap`**<br>|
|[baseURI](baseURI/index.md)|&nbsp;&nbsp;**`val Node.baseURI: String`**<br>|
|[bubbles](bubbles/index.md)|&nbsp;&nbsp;**`val Event.bubbles: Boolean`**<br>|
|[button](button/index.md)|&nbsp;&nbsp;**`val MouseEvent.button: Short`**<br>|
|[cancelable](cancelable/index.md)|&nbsp;&nbsp;**`val Event.cancelable: Boolean`**<br>|
|[childElements](childElements.md)|Returns the child elements of this element with the given name<br>&nbsp;&nbsp;**`fun Element.childElements(name: String): List<Element>`**<br><br>Returns the child elements of this element<br>&nbsp;&nbsp;**`fun Element.childElements(): List<Element>`**<br>|
|[childNodes](childNodes/index.md)|&nbsp;&nbsp;**`val Node.childNodes: NodeList`**<br>|
|[children](children.md)|Returns the children of the element as a list<br>&nbsp;&nbsp;**`fun Element.children(): List<Node>`**<br>|
|[childrenText](childrenText/index.md)|&nbsp;&nbsp;**`val Element.childrenText: String`**<br>|
|[classSet](classSet/index.md)|&nbsp;&nbsp;**`val Element.classSet: MutableSet<String>`**<br>|
|[classes](classes/index.md)|&nbsp;&nbsp;**`val Element.classes: String`**<br>|
|[clear](clear.md)|Removes all the children from this node<br>&nbsp;&nbsp;**`fun Node.clear(): Unit`**<br>|
|[clientX](clientX/index.md)|&nbsp;&nbsp;**`val MouseEvent.clientX: Int`**<br>|
|[clientY](clientY/index.md)|&nbsp;&nbsp;**`val MouseEvent.clientY: Int`**<br>|
|[createDocument](createDocument.md)|Creates a new document with the given document builder<br>&nbsp;&nbsp;**`public fun createDocument(builder: DocumentBuilder): Document`**<br><br>Creates a new document with an optional DocumentBuilderFactory<br>&nbsp;&nbsp;**`public fun createDocument(builderFactory: DocumentBuilderFactory): Document`**<br>|
|[createElement](createElement.md)|Creates a new element which can be configured via a function<br>&nbsp;&nbsp;**`fun Document.createElement(name: String, init: Element.()->Unit): Element`**<br><br>Creates a new element to an element which has an owner Document which can be configured via a function<br>&nbsp;&nbsp;**`fun Element.createElement(name: String, doc: Document, init: Element.()->Unit): Element`**<br>|
|[createTransformer](createTransformer.md)|Creates a new TrAX transformer<br>&nbsp;&nbsp;**`public fun createTransformer(source: Source, factory: TransformerFactory): Transformer`**<br>|
|[ctrlKey](ctrlKey/index.md)|&nbsp;&nbsp;**`val MouseEvent.ctrlKey: Boolean`**<br>|
|[defaultDocumentBuilder](defaultDocumentBuilder.md)|Returns the default [[DocumentBuilder]]<br>&nbsp;&nbsp;**`public fun defaultDocumentBuilder(builderFactory: DocumentBuilderFactory): DocumentBuilder`**<br>|
|[defaultDocumentBuilderFactory](defaultDocumentBuilderFactory.md)|Returns the default [[DocumentBuilderFactory]]<br>&nbsp;&nbsp;**`public fun defaultDocumentBuilderFactory(): DocumentBuilderFactory`**<br>|
|[documentElement](documentElement/index.md)|&nbsp;&nbsp;**`val Document.documentElement: Element`**<br>|
|[elements](elements.md)|Returns all the descendant elements given the local element name<br>&nbsp;&nbsp;**`fun Document.elements(localName: String): List<Element>`**<br>&nbsp;&nbsp;**`fun Element.elements(localName: String): List<Element>`**<br><br>Returns all the descendant elements given the namespace URI and local element name<br>&nbsp;&nbsp;**`fun Document.elements(namespaceUri: String, localName: String): List<Element>`**<br>&nbsp;&nbsp;**`fun Element.elements(namespaceUri: String, localName: String): List<Element>`**<br>|
|[elements](elements/index.md)|The descendent elements of this document<br>&nbsp;&nbsp;**`val Document.elements: List<Element>`**<br><br>The descendant elements of this elements<br>&nbsp;&nbsp;**`val Element.elements: List<Element>`**<br>|
|[emptyElementList](emptyElementList.md)|&nbsp;&nbsp;**`private fun emptyElementList(): List<Element>`**<br>|
|[emptyNodeList](emptyNodeList.md)|&nbsp;&nbsp;**`private fun emptyNodeList(): List<Node>`**<br>|
|[eventHandler](eventHandler.md)|Turns an event handler function into an [EventListener]<br>&nbsp;&nbsp;**`fun eventHandler(handler: (Event)->Unit): EventListener`**<br>|
|[eventPhase](eventPhase/index.md)|&nbsp;&nbsp;**`val Event.eventPhase: Short`**<br>|
|[eventType](eventType/index.md)|&nbsp;&nbsp;**`val Event.eventType: String`**<br>|
|[first](first/index.md)|&nbsp;&nbsp;**`val NodeList.first: Node`**<br>|
|[firstChild](firstChild/index.md)|&nbsp;&nbsp;**`val Node.firstChild: Node`**<br>|
|[get](get.md)|Searches for elements using the element name, an element ID (if prefixed with dot) or element class (if prefixed with #)<br>&nbsp;&nbsp;**`fun Document.get(selector: String): List<Element>`**<br>&nbsp;&nbsp;**`fun Element.get(selector: String): List<Element>`**<br>|
|[getCurrentTarget](getCurrentTarget/index.md)|&nbsp;&nbsp;**`val Event.getCurrentTarget: EventTarget`**<br>|
|[hasClass](hasClass.md)|Returns true if the element has the given CSS class style in its 'class' attribute<br>&nbsp;&nbsp;**`fun Element.hasClass(cssClass: String): Boolean`**<br>|
|[head](head/index.md)|&nbsp;&nbsp;**`val NodeList.head: Node`**<br>|
|[id](id/index.md)|&nbsp;&nbsp;**`val Element.id: String`**<br>|
|[innerHTML](innerHTML/index.md)|Returns the HTML representation of the node<br>&nbsp;&nbsp;**`public val Node.innerHTML: String`**<br>|
|[isText](isText.md)|Returns true if this node is a Text node or a CDATA node<br>&nbsp;&nbsp;**`fun Node.isText(): Boolean`**<br>|
|[last](last/index.md)|&nbsp;&nbsp;**`val NodeList.last: Node`**<br>|
|[lastChild](lastChild/index.md)|&nbsp;&nbsp;**`val Node.lastChild: Node`**<br>|
|[length](length/index.md)|&nbsp;&nbsp;**`val NodeList.length: Int`**<br>&nbsp;&nbsp;**`val CharacterData.length: Int`**<br>&nbsp;&nbsp;**`val NamedNodeMap.length: Int`**<br>&nbsp;&nbsp;**`val NameList.length: Int`**<br>&nbsp;&nbsp;**`val DOMStringList.length: Int`**<br>&nbsp;&nbsp;**`val DOMImplementationList.length: Int`**<br>|
|[localName](localName/index.md)|&nbsp;&nbsp;**`val Node.localName: String`**<br>|
|[metaKey](metaKey/index.md)|&nbsp;&nbsp;**`val MouseEvent.metaKey: Boolean`**<br>|
|[mouseEventHandler](mouseEventHandler.md)|&nbsp;&nbsp;**`fun mouseEventHandler(handler: (MouseEvent)->Unit): EventListener`**<br>|
|[namespaceURI](namespaceURI/index.md)|&nbsp;&nbsp;**`val Node.namespaceURI: String`**<br>|
|[nextElements](nextElements.md)|Returns an [[Iterator]] of all the next [[Element]] siblings<br>&nbsp;&nbsp;**`fun Node.nextElements(): List<Element>`**<br>|
|[nextSibling](nextSibling/index.md)|&nbsp;&nbsp;**`val Node.nextSibling: Node`**<br>|
|[nextSiblings](nextSiblings.md)|Returns an [[Iterator]] over the next siblings of this node<br>&nbsp;&nbsp;**`fun Node.nextSiblings(): Iterable<Node>`**<br>|
|[nodeName](nodeName/index.md)|JVM specific API implementations using JAXP and so forth which would not be used when compiling to JS<br>&nbsp;&nbsp;**`val Node.nodeName: String`**<br>|
|[nodeType](nodeType/index.md)|&nbsp;&nbsp;**`val Node.nodeType: Short`**<br>|
|[nodeValue](nodeValue/index.md)|&nbsp;&nbsp;**`val Node.nodeValue: String`**<br>|
|[nodesToXmlString](nodesToXmlString.md)|Converts the collection of nodes to an XML String<br>&nbsp;&nbsp;**`public fun nodesToXmlString(nodes: Iterable<Node>, xmlDeclaration: Boolean): String`**<br>|
|[on](on.md)|Registers a handler on the named event<br>&nbsp;&nbsp;**`public fun Node.on(name: String, capture: Boolean, handler: (Event)->Unit): Closeable`**<br><br>Registers an [EventListener] on the named event<br>&nbsp;&nbsp;**`public fun Node.on(name: String, capture: Boolean, listener: EventListener): Closeable`**<br>|
|[onClick](onClick.md)|&nbsp;&nbsp;**`public fun Node.onClick(capture: Boolean, handler: (MouseEvent)->Unit): Closeable`**<br>|
|[onDoubleClick](onDoubleClick.md)|&nbsp;&nbsp;**`public fun Node.onDoubleClick(capture: Boolean, handler: (MouseEvent)->Unit): Closeable`**<br>|
|[outerHTML](outerHTML/index.md)|Returns the HTML representation of the node<br>&nbsp;&nbsp;**`public val Node.outerHTML: String`**<br><br>Returns the HTML representation of the nodes<br>&nbsp;&nbsp;**`public val NodeList.outerHTML: String`**<br>|
|[ownerDocument](ownerDocument.md)|Returns the owner document of the element or uses the provided document<br>&nbsp;&nbsp;**`fun Node.ownerDocument(doc: Document): Document`**<br>|
|[ownerDocument](ownerDocument/index.md)|&nbsp;&nbsp;**`val Node.ownerDocument: Document`**<br>|
|[parentNode](parentNode/index.md)|&nbsp;&nbsp;**`val Node.parentNode: Node`**<br>|
|[parseXml](parseXml.md)|Parses the XML document using the given *inputSource*<br>&nbsp;&nbsp;**`public fun parseXml(inputSource: InputSource, builder: DocumentBuilder): Document`**<br><br>Parses the XML document using the given *inputStream*<br>&nbsp;&nbsp;**`public fun parseXml(inputStream: InputStream, builder: DocumentBuilder): Document`**<br><br>Parses the XML document using the given *uri*<br>&nbsp;&nbsp;**`public fun parseXml(uri: String, builder: DocumentBuilder): Document`**<br><br>Parses the XML document using the given *file*<br>&nbsp;&nbsp;**`public fun parseXml(file: File, builder: DocumentBuilder): Document`**<br>|
|[plus](plus.md)|&nbsp;&nbsp;**`fun Element.plus(text: String): Element`**<br>&nbsp;&nbsp;**`fun Node.plus(child: Node): Node`**<br>|
|[plusAssign](plusAssign.md)|&nbsp;&nbsp;**`fun Element.plusAssign(text: String): Element`**<br>|
|[prefix](prefix/index.md)|&nbsp;&nbsp;**`val Node.prefix: String`**<br>|
|[previousElements](previousElements.md)|Returns an [[Iterator]] of all the previous [[Element]] siblings<br>&nbsp;&nbsp;**`fun Node.previousElements(): List<Element>`**<br>|
|[previousSibling](previousSibling/index.md)|&nbsp;&nbsp;**`val Node.previousSibling: Node`**<br>|
|[previousSiblings](previousSiblings.md)|Returns an [[Iterator]] over the next siblings of this node<br>&nbsp;&nbsp;**`fun Node.previousSiblings(): Iterable<Node>`**<br>|
|[relatedTarget](relatedTarget/index.md)|&nbsp;&nbsp;**`val MouseEvent.relatedTarget: EventTarget`**<br>|
|[removeClass](removeClass.md)|Removes the given CSS class to this element's 'class' attribute<br>&nbsp;&nbsp;**`fun Element.removeClass(cssClass: String): Boolean`**<br>|
|[screenX](screenX/index.md)|&nbsp;&nbsp;**`val MouseEvent.screenX: Int`**<br>|
|[screenY](screenY/index.md)|&nbsp;&nbsp;**`val MouseEvent.screenY: Int`**<br>|
|[shiftKey](shiftKey/index.md)|&nbsp;&nbsp;**`val MouseEvent.shiftKey: Boolean`**<br>|
|[style](style/index.md)|&nbsp;&nbsp;**`val Element.style: String`**<br>|
|[tail](tail/index.md)|&nbsp;&nbsp;**`val NodeList.tail: Node`**<br>|
|[target](target/index.md)|&nbsp;&nbsp;**`val Event.target: EventTarget`**<br>|
|[text](text/index.md)|&nbsp;&nbsp;**`val Node.text: String`**<br>|
|[textContent](textContent/index.md)|&nbsp;&nbsp;**`val Node.textContent: String`**<br>|
|[timeStamp](timeStamp/index.md)|&nbsp;&nbsp;**`val Event.timeStamp: Long`**<br>|
|[toElementList](toElementList.md)|&nbsp;&nbsp;**`fun NodeList.toElementList(): List<Element>`**<br>|
|[toList](toList.md)|&nbsp;&nbsp;**`fun NodeList.toList(): List<Node>`**<br>|
|[toXmlString](toXmlString.md)|Converts the node to an XML String<br>&nbsp;&nbsp;**`public fun Node.toXmlString(xmlDeclaration: Boolean): String`**<br>&nbsp;&nbsp;**`public fun Node.toXmlString(): String`**<br><br>Converts the node list to an XML String<br>&nbsp;&nbsp;**`fun NodeList.toXmlString(xmlDeclaration: Boolean): String`**<br>|
|[writeXmlString](writeXmlString.md)|Converts the node to an XML String and writes it to the given [[Writer]]<br>&nbsp;&nbsp;**`public fun Node.writeXmlString(writer: Writer, xmlDeclaration: Boolean): Unit`**<br>|
