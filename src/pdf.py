from subprocess import check_call
from os import path, remove

from bs4 import BeautifulSoup

root_folder_path = path.dirname(path.dirname(__file__))
pdf_folder_path = path.join(root_folder_path, 'pdf')
pdf_source_path = path.join(root_folder_path, 'dist', 'docs')

PDF_CONFIG = {
    'encoding': 'UTF-8',
    'page-size': 'A4',
    'margin-top': '1in',
    'margin-right': '0.7in',
    'margin-bottom': '0.8in',
    'margin-left': '0.7in',
    'print-media-type': '',
    'dpi': '96',
    'footer-center': '[page]',
    'footer-font-size': '9',
    'footer-spacing': '7',
    'enable-smart-shrinking': '',
    'enable-local-file-access': '',
    'zoom': '1.3'
}

PDF_TOC_CONFIG = {
    'xsl-style-sheet': path.join(pdf_folder_path, "toc.xsl")
}


def get_tmp_filename(file_path):
    name = path.basename(file_path)
    return path.join(file_path[0:-len(name)], '_' + name)


def transform_book_cover(path_file, data):
    with open(path_file, 'r', encoding="UTF-8") as file:
        version = data["releases"]["latest"]["version"]
        soup = BeautifulSoup(file.read(), "html.parser")

        node = soup.find("span", {"class": "version"})
        node.string.replace_with(version)

        result_file = get_tmp_filename(path_file)

        with open(result_file, "wb") as output:
            output.write(soup.encode("utf-8"))

        return result_file


def transform_book_content(path_file):
    with open(path_file, "r", encoding="utf-8") as file:
        html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <link rel="stylesheet" href="file://{pdf_folder_path}/prism.css">
                <link rel="stylesheet" href="file://{pdf_folder_path}/webhelp.css">
                <script src="file://{pdf_folder_path}/prism.js" data-manual></script>
                <script src="file://{pdf_folder_path}/pdf.js"></script>
            </head>
            <body>{file.read()}</body></html>
        """

        soup = BeautifulSoup(html, "html.parser")

        result_file = get_tmp_filename(path_file)

        with open(result_file, "w", encoding='utf-8') as output:
            output.write(str(soup))

        return result_file


def generate_pdf(name, data):
    source_file_path = path.join(pdf_source_path, 'pdf.html')
    output_file_path = path.join(pdf_folder_path, name)

    arguments = ["wkhtmltopdf"]
    for name, value in PDF_CONFIG.items():
        arguments.append("--" + name)
        if value != '':
            arguments.append(value)

    source_cover_path = path.join(pdf_folder_path, 'book-cover.html')

    print("Preparing cover...")
    transformed_cover_path = transform_book_cover(source_cover_path, data)
    arguments.append('cover')
    arguments.append(transformed_cover_path)

    arguments.append('toc')
    for name, value in PDF_TOC_CONFIG.items():
        arguments.append("--" + name)
        arguments.append(value)

    print("Preprocess general content...")
    transformed_file_path = transform_book_content(source_file_path)
    arguments.append(transformed_file_path)
    arguments.append(output_file_path)

    print(" ".join(arguments))

    check_call(" ".join(arguments), shell=True, cwd=pdf_folder_path)

    # _cleanup
    #if transformed_cover_path != source_cover_path: remove(transformed_cover_path)
    #if transformed_file_path != source_file_path: remove(transformed_file_path)

    return output_file_path
