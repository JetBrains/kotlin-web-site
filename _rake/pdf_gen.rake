require 'pdfkit'

desc 'Builds PDF'
task :pdf_gen do
  tmpdir = __dir__ + '/tmp'

  if File.directory?(tmpdir)
    rm_r tmpdir
  end

  mkdir tmpdir
  cd '..'
  cp_r '_data', tmpdir
  cp_r '_includes', tmpdir
  cp_r '_layouts', tmpdir
  cp_r '_plugins', tmpdir
  cp_r 'assets', tmpdir
  cp_r 'css', tmpdir
  cp_r 'docs', tmpdir
  cp_r '_config.yml', tmpdir
  cd tmpdir

  files = Converter::scan_dir(tmpdir + '/docs/reference', '*.md')
  files.each do |filename|
    file_content = File.read(filename)
    file_content = file_content.gsub(/layout\:\s([^\n]*)/, 'layout: printable')
    File.open(filename, 'w') { |file| file.write(file_content) }
  end

  next

  cd tmpdir
  sh 'jekyll build'

  html = []
  files = Converter::scan_dir(tmpdir + '/_site/docs/reference', '*.html')
  files.each do |filename|
    file_content = File.read(filename)
    html.push(file_content)
  end

  html = html.join('')

  PDFKit.configure do |config|
    config.wkhtmltopdf = 'C:/wkhtmltopdf/bin/wkhtmltopdf.exe'
    config.default_options = {
        :page_size     => 'Letter',
        :margin_top    => '0.5in',
        :margin_right  => '0.5in',
        :margin_bottom => '0.7in',
        :margin_left   => '0.5in'
    }
  end

  pdf = PDFKit.new(html)
  #pdf.stylesheets << tmpdir + '/css/components/page-content/page-content.css'
  pdf.to_file('test.pdf')
end
