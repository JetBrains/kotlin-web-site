require 'uri'
require 'erb'
require 'nokogiri'
require 'pathname'

desc 'Builds PDF'
task :build_pdf do
  source_dir = CONFIG[:source_dir]
  tmp_dir = CONFIG[:tmp_dir]
  pdf_filename = CONFIG[:pdf_filename]

  # http://madalgo.au.dk/~jakobt/wkhtmltoxdoc/wkhtmltopdf-0.9.9-doc.html
  pdf_config = {
      'enable-smart-shrinking' => '',
      'page-size' => 'A4',
      'margin-top' => '1in',
      'margin-right' => '0.7in',
      'margin-bottom' => '0.8in',
      'margin-left' => '0.7in',
      'encoding' => 'UTF-8',
      'print-media-type' => '',
      'header-html' => "#{source_dir}/_rake/build_pdf/book-page-header.html",
      'header-spacing' => '10',
      'footer-html' => "#{source_dir}/_rake/build_pdf/book-page-footer.html",
      'footer-spacing' => '7'
  }

  pdf_toc_config = {
      'xsl-style-sheet' => "#{source_dir}/_rake/build_pdf/toc.xsl",
      'header-html' => "''"
  }

  pdf_options_str = pdf_config.map{|key, value| "--#{key} #{value}"}.join(' ')
  pdf_toc_options_str = pdf_toc_config.map{|key, value| "--#{key} #{value}"}.join(' ')

  build_html(tmp_dir)

  css_content = [
      File.read("#{source_dir}/css/reset.css"),
      File.read("#{source_dir}/css/com/page-content/page-content.css")
  ].join('')

  doc_content = get_doc_contents

  doc_content = render_erb("#{source_dir}/_rake/build_pdf/book-layout.erb", {
      :css_content => css_content,
      :content => doc_content
  })

  File.write("#{tmp_dir}/tmp.html", doc_content)

  system "wkhtmltopdf #{pdf_options_str} cover #{source_dir}/_rake/build_pdf/book-cover.html toc #{pdf_toc_options_str} #{tmp_dir}/tmp.html #{pdf_filename}"
  rm_r "#{tmp_dir}"
  puts ""
  puts "Saved to #{pdf_filename}"
end


def scan_dir path, pattern = '*'
  files = []
  Dir.glob(path + '/' + pattern) do |filename|
    next if filename == '.' or filename == '..'
    files.push(filename)
  end
  files
end


def build_html dir
  if File.directory?(dir)
    rm_r dir
  end

  mkdir dir
  cp_r '_data', dir
  cp_r '_includes', dir
  cp_r '_layouts', dir
  cp_r '_plugins', dir
  cp_r 'assets', dir
  cp_r 'docs', dir
  cp_r '_config.yml', dir
  cd dir

  files = scan_dir("#{dir}/docs/reference", '*.md')
  files.each do |filename|
    file_content = File.read(filename)
    file_content = file_content.gsub(/layout\:\s([^\n]*)/, 'layout: pdf')
    File.open(filename, 'w') { |file| file.write(file_content) }
  end

  system "#{CONFIG[:source_dir]}/bin/jekyll build --source=#{dir} --destination=#{dir}/_site"
end


def get_doc_contents
  source_dir = CONFIG[:source_dir]
  tmp_dir = CONFIG[:tmp_dir]
  doc_content = []

  toc = YAML::load_file("#{source_dir}/_data/_nav.yml")

  toc["reference"].each do |toc_data|
    section = {
        'id' => ERB::Util.url_encode(toc_data['title'].sub(' ', '_')),
        'title' => toc_data['title'],
        'content' => []
    }

    if toc_data["content"]
      toc_data['content'].each do |item|
        item.each do |file_path, title|
          file_path = "#{tmp_dir}/_site/#{file_path}"
          file_basename = Pathname.new(file_path).basename

          if File.file?(file_path) == false
            next
          end

          file_content = File.read(file_path)
          page = {
              'id' => file_basename,
              'title' => title,
          }

          xml_doc = Nokogiri::HTML::Document.parse(file_content)

          # Add pageid prefixes to all nodes
          xml_doc.search("*[@id]").each do |node|
            node['data-old-id'] = node['id']
            node['id'] = "#{page['id']}_#{node['id']}"
          end

          # Rename all headings to lower level
          5.downto(1) {|i|
            xml_doc.search("h#{i}").each do |node|
              node.name = "h#{i + 1}"
            end
          }

          # Resolving links and anchors
          xml_doc.search("a").each do |link|
            uri = URI.parse(link['href'])
            new_anchor_id = link['href']

            # Local link
            if uri.scheme == nil
              #link['data-old-href'] = link['href']

              # Anchor
              if link['href'].match(/^#/)
                new_anchor_id = "#{page['id']}_#{uri.fragment}"
              # Link to another page
              else
                new_anchor_id = "#{uri.path}" + ((uri.fragment != nil) ? "_#{uri.fragment}" : "")
              end

              link['href'] = "#" + new_anchor_id

            end
          end

          page['content'] = xml_doc.at('body').children.to_html
          section['content'].push(page)
        end
      end

    end

    doc_content.push(section)
  end

  doc_content
end