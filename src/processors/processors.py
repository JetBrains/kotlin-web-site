import re

replace_simple_code = False

languageMimeTypeMap = {
    "kotlin": "text/x-kotlin",
    "java": "text/x-java",
    "groovy": "text/x-groovy",
    "xml": "application/xml",
    "yaml": "text/x-yaml",
    "bash": "text/x-sh",
    "shell": "text/x-sh",
    "swift": "text/x-swift",
    "obj-c": "text/x-objectivec",
    "html": "application/xml",
    "javascript": "text/javascript",
    "json": "application/json",
    "js": "text/javascript",
    "c": "text/x-csrc",
    "text": "text/plain"
}


def set_replace_simple_code(v: bool):
    global replace_simple_code
    replace_simple_code = v


def find_closest_tag(element, tagname):
    current_element = element.parent
    while current_element is not None and current_element.name != tagname:
        current_element = current_element.parent
    return current_element


processors = {
    'h1': 'typo-header typo-h1',
    'h2': 'typo-header typo-h2',
    'h3': 'typo-header typo-h3',
    'h4': 'typo-header typo-h4',

    'ul': 'typo-list typo-list_type_simple',
    'ol': 'typo-list typo-list_type_ordered',
    'li': 'typo-list__item',

    'p': 'typo-para',
    'a': 'typo-link',
    'blockquote': 'typo-quote',
    'hr': 'typo-hr',
    'img': 'typo-image',
    'strong': 'type-strong'
}


def process_markdown_html(tree):
    tree = process_code_blocks(tree)

    for element in tree.select('*'):
        appendClass = processors.get(element.name)
        if appendClass is not None:
            if element.has_attr('class'):
                element['class'].append(processors.get(element.name))
            else:
                element['class'] = processors.get(element.name)

    return tree

def process_code_blocks(tree):
    if replace_simple_code:
        # some spellcheckers may not know what to do with <code> elements,
        # we replace in-line code blocks with span to improve spellcheckers
        # TODO: avoid global variable hack here and pass the parameter explicitly
        for element in tree.select("code"):
            if len(element.attrs) == 0:
                element.name = "span"
                element['style'] = "font-style: italic; text-decoration: underline;"

    for element in tree.select('pre > code'):
        class_names = element.get("class")
        lang = None
        if class_names is not None:
            for class_name in class_names:
                if class_name.startswith("language-"):
                    lang = class_name[len("language-"):]

        if lang is None:
            continue

        parent_div = find_closest_tag(element, 'div')
        # Skip executable samples
        if parent_div is not None and parent_div.has_attr('class') and "sample" in parent_div['class']:
            continue
        element['data-lang'] = languageMimeTypeMap[lang]
        element['class'] = "code _highlighted"

    return tree


def process_header_ids(tree):
    header_elements = tree.select('h1,h2,h3')
    for header in header_elements:
        if header.get("id") is not None:
            continue
        generated_id = re.sub(r'[^a-zA-Z0-9 \\-]', '', header.text)
        generated_id = generated_id.replace(' ', '-')
        generated_id = generated_id.lower()
        generated_id = generated_id.strip()
        header['id'] = generated_id
    return tree
