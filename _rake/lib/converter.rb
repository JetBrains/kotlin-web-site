class Converter
  def self.scan_dir(path, pattern = '*')
    files = []
    Dir.glob(path + '/' + pattern) do |filename|
      next if filename == '.' or filename == '..'
      files.push(filename)
    end
    files
  end

  def self.convert_markdown2html(content)
    splitted = content.split('---')

    if splitted[0] == ''
      splitted.delete_at(0)
      splitted.delete_at(0)
    end

    content = (splitted.length > 1) ? splitted.join('---') : splitted.join('')

    doc = Kramdown::Document.new(content, {
        :input => 'GFM',
        :auto_id_stripping => true
    })

    return doc.to_html
  end
end