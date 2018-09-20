import re

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
    "c": "text/x-csrc"
}


def find_closest_tag(element, tagname):
    current_element = element.parent
    while current_element is not None and current_element.name != tagname:
        current_element = current_element.parent
    return current_element


def process_code_blocks(tree):
    code_elements = tree.select('pre > code')
    for element in code_elements:
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
