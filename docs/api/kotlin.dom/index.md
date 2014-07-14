---
layout: api
title: kotlin.dom
---
[stdlib](../index.html) / [kotlin.dom](index.html)

# kotlin.dom

```
package kotlin.dom
```
## Members
| Name | Summary |
|------|---------|
|[CloseableEventListener](CloseableEventListener/index.html)|&nbsp;&nbsp;`private class CloseableEventListener`<br>|
|[ElementListAsList](ElementListAsList/index.html)|&nbsp;&nbsp;`class ElementListAsList`<br>|
|[EventListenerHandler](EventListenerHandler/index.html)|&nbsp;&nbsp;`private class EventListenerHandler`<br>|
|[NextSiblings](NextSiblings/index.html)|&nbsp;&nbsp;`class NextSiblings`<br>|
|[NodeListAsList](NodeListAsList/index.html)|TODO this approach generates compiler errors...<br>&nbsp;&nbsp;`class NodeListAsList`<br>|
|[PreviousSiblings](PreviousSiblings/index.html)|&nbsp;&nbsp;`class PreviousSiblings`<br>|
|[addClass](addClass.html)|Adds the given CSS class to this element's 'class' attribute<br>&nbsp;&nbsp;`fun Element.addClass(cssClass: String): Boolean`<br>|
|[addElement](addElement.html)|Adds a newly created element to an element which has an owner Document which can be configured via a function<br>&nbsp;&nbsp;`fun Element.addElement(name: String, doc: Document, init: Element.()->Unit): Element`<br><br>Adds a newly created element which can be configured via a function<br>&nbsp;&nbsp;`fun Document.addElement(name: String, init: Element.()->Unit): Element`<br>|
|[addText](addText.html)|Adds a newly created text node to an element which either already has an owner Document or one must be provided as a parameter<br>&nbsp;&nbsp;`fun Element.addText(text: String, doc: Document): Element`<br>|
|[altKey](altKey/index.html)|&nbsp;&nbsp;`val MouseEvent.altKey: Boolean`<br>|
|[attribute](attribute.html)|Returns the attribute value or empty string if its not present<br>&nbsp;&nbsp;`fun Element.attribute(name: String): String`<br>|
|[attributes](attributes/index.html)|&nbsp;&nbsp;`val Node.attributes: NamedNodeMap`<br>|
|[baseURI](baseURI/index.html)|&nbsp;&nbsp;`val Node.baseURI: String`<br>|
|[bubbles](bubbles/index.html)|&nbsp;&nbsp;`val Event.bubbles: Boolean`<br>|
|[button](button/index.html)|&nbsp;&nbsp;`val MouseEvent.button: Short`<br>|
|[cancelable](cancelable/index.html)|&nbsp;&nbsp;`val Event.cancelable: Boolean`<br>|
|[childElements](childElements.html)|Returns the child elements of this element with the given name<br>&nbsp;&nbsp;`fun Element.childElements(name: String): List<Element>`<br><br>Returns the child elements of this element<br>&nbsp;&nbsp;`fun Element.childElements(): List<Element>`<br>|
|[childNodes](childNodes/index.html)|&nbsp;&nbsp;`val Node.childNodes: NodeList`<br>|
|[children](children.html)|Returns the children of the element as a list<br>&nbsp;&nbsp;`fun Element.children(): List<Node>`<br>|
|[childrenText](childrenText/index.html)|&nbsp;&nbsp;`val Element.childrenText: String`<br>|
|[classSet](classSet/index.html)|&nbsp;&nbsp;`val Element.classSet: MutableSet<String>`<br>|
|[classes](classes/index.html)|&nbsp;&nbsp;`val Element.classes: String`<br>|
|[clear](clear.html)|Removes all the children from this node<br>&nbsp;&nbsp;`fun Node.clear(): Unit`<br>|
|[clientX](clientX/index.html)|&nbsp;&nbsp;`val MouseEvent.clientX: Int`<br>|
|[clientY](clientY/index.html)|&nbsp;&nbsp;`val MouseEvent.clientY: Int`<br>|
|[createDocument](createDocument.html)|Creates a new document with an optional DocumentBuilderFactory<br>&nbsp;&nbsp;`public fun createDocument(builderFactory: DocumentBuilderFactory): Document`<br><br>Creates a new document with the given document builder<br>&nbsp;&nbsp;`public fun createDocument(builder: DocumentBuilder): Document`<br>|
|[createElement](createElement.html)|Creates a new element to an element which has an owner Document which can be configured via a function<br>&nbsp;&nbsp;`fun Element.createElement(name: String, doc: Document, init: Element.()->Unit): Element`<br><br>Creates a new element which can be configured via a function<br>&nbsp;&nbsp;`fun Document.createElement(name: String, init: Element.()->Unit): Element`<br>|
|[createTransformer](createTransformer.html)|Creates a new TrAX transformer<br>&nbsp;&nbsp;`public fun createTransformer(source: Source, factory: TransformerFactory): Transformer`<br>|
|[ctrlKey](ctrlKey/index.html)|&nbsp;&nbsp;`val MouseEvent.ctrlKey: Boolean`<br>|
|[defaultDocumentBuilder](defaultDocumentBuilder.html)|Returns the default [[DocumentBuilder]]<br>&nbsp;&nbsp;`public fun defaultDocumentBuilder(builderFactory: DocumentBuilderFactory): DocumentBuilder`<br>|
|[defaultDocumentBuilderFactory](defaultDocumentBuilderFactory.html)|Returns the default [[DocumentBuilderFactory]]<br>&nbsp;&nbsp;`public fun defaultDocumentBuilderFactory(): DocumentBuilderFactory`<br>|
|[documentElement](documentElement/index.html)|&nbsp;&nbsp;`val Document.documentElement: Element`<br>|
|[elements](elements.html)|Returns all the descendant elements given the namespace URI and local element name<br>&nbsp;&nbsp;`fun Document.elements(namespaceUri: String, localName: String): List<Element>`<br>&nbsp;&nbsp;`fun Element.elements(namespaceUri: String, localName: String): List<Element>`<br><br>Returns all the descendant elements given the local element name<br>&nbsp;&nbsp;`fun Document.elements(localName: String): List<Element>`<br>&nbsp;&nbsp;`fun Element.elements(localName: String): List<Element>`<br>|
|[elements](elements/index.html)|The descendent elements of this document<br>&nbsp;&nbsp;`val Document.elements: List<Element>`<br><br>The descendant elements of this elements<br>&nbsp;&nbsp;`val Element.elements: List<Element>`<br>|
|[emptyElementList](emptyElementList.html)|&nbsp;&nbsp;`private fun emptyElementList(): List<Element>`<br>|
|[emptyNodeList](emptyNodeList.html)|&nbsp;&nbsp;`private fun emptyNodeList(): List<Node>`<br>|
|[eventHandler](eventHandler.html)|Turns an event handler function into an [EventListener]<br>&nbsp;&nbsp;`fun eventHandler(handler: (Event)->Unit): EventListener`<br>|
|[eventPhase](eventPhase/index.html)|&nbsp;&nbsp;`val Event.eventPhase: Short`<br>|
|[eventType](eventType/index.html)|&nbsp;&nbsp;`val Event.eventType: String`<br>|
|[first](first/index.html)|&nbsp;&nbsp;`val NodeList.first: Node`<br>|
|[firstChild](firstChild/index.html)|&nbsp;&nbsp;`val Node.firstChild: Node`<br>|
|[get](get.html)|Searches for elements using the element name, an element ID (if prefixed with dot) or element class (if prefixed with #)<br>&nbsp;&nbsp;`fun Document.get(selector: String): List<Element>`<br>&nbsp;&nbsp;`fun Element.get(selector: String): List<Element>`<br>|
|[getCurrentTarget](getCurrentTarget/index.html)|&nbsp;&nbsp;`val Event.getCurrentTarget: EventTarget`<br>|
|[hasClass](hasClass.html)|Returns true if the element has the given CSS class style in its 'class' attribute<br>&nbsp;&nbsp;`fun Element.hasClass(cssClass: String): Boolean`<br>|
|[head](head/index.html)|&nbsp;&nbsp;`val NodeList.head: Node`<br>|
|[id](id/index.html)|&nbsp;&nbsp;`val Element.id: String`<br>|
|[innerHTML](innerHTML/index.html)|Returns the HTML representation of the node<br>&nbsp;&nbsp;`public val Node.innerHTML: String`<br>|
|[isText](isText.html)|Returns true if this node is a Text node or a CDATA node<br>&nbsp;&nbsp;`fun Node.isText(): Boolean`<br>|
|[last](last/index.html)|&nbsp;&nbsp;`val NodeList.last: Node`<br>|
|[lastChild](lastChild/index.html)|&nbsp;&nbsp;`val Node.lastChild: Node`<br>|
|[length](length/index.html)|&nbsp;&nbsp;`val NodeList.length: Int`<br>&nbsp;&nbsp;`val NameList.length: Int`<br>&nbsp;&nbsp;`val DOMStringList.length: Int`<br>&nbsp;&nbsp;`val NamedNodeMap.length: Int`<br>&nbsp;&nbsp;`val CharacterData.length: Int`<br>&nbsp;&nbsp;`val DOMImplementationList.length: Int`<br>|
|[localName](localName/index.html)|&nbsp;&nbsp;`val Node.localName: String`<br>|
|[metaKey](metaKey/index.html)|&nbsp;&nbsp;`val MouseEvent.metaKey: Boolean`<br>|
|[mouseEventHandler](mouseEventHandler.html)|&nbsp;&nbsp;`fun mouseEventHandler(handler: (MouseEvent)->Unit): EventListener`<br>|
|[namespaceURI](namespaceURI/index.html)|&nbsp;&nbsp;`val Node.namespaceURI: String`<br>|
|[nextElements](nextElements.html)|Returns an [[Iterator]] of all the next [[Element]] siblings<br>&nbsp;&nbsp;`fun Node.nextElements(): List<Element>`<br>|
|[nextSibling](nextSibling/index.html)|&nbsp;&nbsp;`val Node.nextSibling: Node`<br>|
|[nextSiblings](nextSiblings.html)|Returns an [[Iterator]] over the next siblings of this node<br>&nbsp;&nbsp;`fun Node.nextSiblings(): Iterable<Node>`<br>|
|[nodeName](nodeName/index.html)|JVM specific API implementations using JAXP and so forth which would not be used when compiling to JS<br>&nbsp;&nbsp;`val Node.nodeName: String`<br>|
|[nodeType](nodeType/index.html)|&nbsp;&nbsp;`val Node.nodeType: Short`<br>|
|[nodeValue](nodeValue/index.html)|&nbsp;&nbsp;`val Node.nodeValue: String`<br>|
|[nodesToXmlString](nodesToXmlString.html)|Converts the collection of nodes to an XML String<br>&nbsp;&nbsp;`public fun nodesToXmlString(nodes: Iterable<Node>, xmlDeclaration: Boolean): String`<br>|
|[on](on.html)|Registers an [EventListener] on the named event<br>&nbsp;&nbsp;`public fun Node.on(name: String, capture: Boolean, listener: EventListener): Closeable`<br><br>Registers a handler on the named event<br>&nbsp;&nbsp;`public fun Node.on(name: String, capture: Boolean, handler: (Event)->Unit): Closeable`<br>|
|[onClick](onClick.html)|&nbsp;&nbsp;`public fun Node.onClick(capture: Boolean, handler: (MouseEvent)->Unit): Closeable`<br>|
|[onDoubleClick](onDoubleClick.html)|&nbsp;&nbsp;`public fun Node.onDoubleClick(capture: Boolean, handler: (MouseEvent)->Unit): Closeable`<br>|
|[outerHTML](outerHTML/index.html)|Returns the HTML representation of the node<br>&nbsp;&nbsp;`public val Node.outerHTML: String`<br><br>Returns the HTML representation of the nodes<br>&nbsp;&nbsp;`public val NodeList.outerHTML: String`<br>|
|[ownerDocument](ownerDocument/index.html)|&nbsp;&nbsp;`val Node.ownerDocument: Document`<br>|
|[ownerDocument](ownerDocument.html)|Returns the owner document of the element or uses the provided document<br>&nbsp;&nbsp;`fun Node.ownerDocument(doc: Document): Document`<br>|
|[parentNode](parentNode/index.html)|&nbsp;&nbsp;`val Node.parentNode: Node`<br>|
|[parseXml](parseXml.html)|Parses the XML document using the given *uri*<br>&nbsp;&nbsp;`public fun parseXml(uri: String, builder: DocumentBuilder): Document`<br><br>Parses the XML document using the given *inputStream*<br>&nbsp;&nbsp;`public fun parseXml(inputStream: InputStream, builder: DocumentBuilder): Document`<br><br>Parses the XML document using the given *file*<br>&nbsp;&nbsp;`public fun parseXml(file: File, builder: DocumentBuilder): Document`<br><br>Parses the XML document using the given *inputSource*<br>&nbsp;&nbsp;`public fun parseXml(inputSource: InputSource, builder: DocumentBuilder): Document`<br>|
|[plus](plus.html)|&nbsp;&nbsp;`fun Element.plus(text: String): Element`<br>&nbsp;&nbsp;`fun Node.plus(child: Node): Node`<br>|
|[plusAssign](plusAssign.html)|&nbsp;&nbsp;`fun Element.plusAssign(text: String): Element`<br>|
|[prefix](prefix/index.html)|&nbsp;&nbsp;`val Node.prefix: String`<br>|
|[previousElements](previousElements.html)|Returns an [[Iterator]] of all the previous [[Element]] siblings<br>&nbsp;&nbsp;`fun Node.previousElements(): List<Element>`<br>|
|[previousSibling](previousSibling/index.html)|&nbsp;&nbsp;`val Node.previousSibling: Node`<br>|
|[previousSiblings](previousSiblings.html)|Returns an [[Iterator]] over the next siblings of this node<br>&nbsp;&nbsp;`fun Node.previousSiblings(): Iterable<Node>`<br>|
|[relatedTarget](relatedTarget/index.html)|&nbsp;&nbsp;`val MouseEvent.relatedTarget: EventTarget`<br>|
|[removeClass](removeClass.html)|Removes the given CSS class to this element's 'class' attribute<br>&nbsp;&nbsp;`fun Element.removeClass(cssClass: String): Boolean`<br>|
|[screenX](screenX/index.html)|&nbsp;&nbsp;`val MouseEvent.screenX: Int`<br>|
|[screenY](screenY/index.html)|&nbsp;&nbsp;`val MouseEvent.screenY: Int`<br>|
|[shiftKey](shiftKey/index.html)|&nbsp;&nbsp;`val MouseEvent.shiftKey: Boolean`<br>|
|[style](style/index.html)|&nbsp;&nbsp;`val Element.style: String`<br>|
|[tail](tail/index.html)|&nbsp;&nbsp;`val NodeList.tail: Node`<br>|
|[target](target/index.html)|&nbsp;&nbsp;`val Event.target: EventTarget`<br>|
|[text](text/index.html)|&nbsp;&nbsp;`val Node.text: String`<br>|
|[textContent](textContent/index.html)|&nbsp;&nbsp;`val Node.textContent: String`<br>|
|[timeStamp](timeStamp/index.html)|&nbsp;&nbsp;`val Event.timeStamp: Long`<br>|
|[toElementList](toElementList.html)|&nbsp;&nbsp;`fun NodeList.toElementList(): List<Element>`<br>|
|[toList](toList.html)|&nbsp;&nbsp;`fun NodeList.toList(): List<Node>`<br>|
|[toXmlString](toXmlString.html)|Converts the node to an XML String<br>&nbsp;&nbsp;`public fun Node.toXmlString(xmlDeclaration: Boolean): String`<br>&nbsp;&nbsp;`public fun Node.toXmlString(): String`<br><br>Converts the node list to an XML String<br>&nbsp;&nbsp;`fun NodeList.toXmlString(xmlDeclaration: Boolean): String`<br>|
|[writeXmlString](writeXmlString.html)|Converts the node to an XML String and writes it to the given [[Writer]]<br>&nbsp;&nbsp;`public fun Node.writeXmlString(writer: Writer, xmlDeclaration: Boolean): Unit`<br>|
