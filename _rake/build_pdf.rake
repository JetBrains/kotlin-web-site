require 'pathname'
require 'rexml/document'
require 'uri'
require 'cgi'
require 'erb'

# http://madalgo.au.dk/~jakobt/wkhtmltoxdoc/wkhtmltopdf-0.9.9-doc.html
PDF_CONFIG = {
    'encoding' => 'UTF-8',
    'page-size' => 'A4',
    'margin-top' => '1in',
    'margin-right' => '0.7in',
    'margin-bottom' => '0.8in',
    'margin-left' => '0.7in',
    'print-media-type' => '',
    'footer-center' => '[page]',
    'footer-font-size' => '9',
    'footer-spacing' => '7',
    'enable-smart-shrinking' => '',
    'zoom' => '0.9'
}

PDF_TOC_CONFIG = {
    'xsl-style-sheet' => "#{CONFIG[:source_dir]}/_rake/build_pdf/toc.xsl",
    'header-html' => "''"
}

desc 'Builds PDF'
task :build_pdf do
  source_dir = CONFIG[:source_dir]
  tmp_dir = CONFIG[:tmp_dir]
  pdf_filename = ENV['dest'] || CONFIG[:pdf_filename]
  pdf_filename = File.expand_path(pdf_filename)
  pdf_options_str = PDF_CONFIG.map{|key, value| "--#{key} #{value}"}.join(' ')
  pdf_toc_options_str = PDF_TOC_CONFIG.map{|key, value| "--#{key} #{value}"}.join(' ')

  puts "Isolate current Jekyll installation"
  build_html(tmp_dir)

  puts "Extract data from docs"
  doc_content = get_doc_contents

  doc_content = render_erb("#{source_dir}/_rake/build_pdf/book-layout.erb", {
      :source_dir => source_dir,
      :content => doc_content
  })

  File.write("#{tmp_dir}/tmp.html", doc_content)

  unless system "wkhtmltopdf #{pdf_options_str} cover #{source_dir}/_rake/build_pdf/book-cover.html toc #{pdf_toc_options_str} #{tmp_dir}/tmp.html #{pdf_filename}"
    $stderr.puts "Can't build, see build log for details"
    exit 1
  end
  rm_r "#{tmp_dir}"
  puts ""
  puts "Saved to #{pdf_filename}"
end


def build_html dir
  if File.directory?(dir)
    FileUtils.rm_r dir
  end

  FileUtils.mkdir dir
  FileUtils.cp_r %w(_data _includes _layouts _plugins assets docs _config.yml), dir
  FileUtils.cp "#{dir}/_layouts/pdf.html", "#{dir}/_layouts/reference.html" # substitute the original page layout
  FileUtils.cp "#{dir}/_layouts/pdf.html", "#{dir}/_layouts/api.html" # substitute the original page layout
  FileUtils.cd dir

  unless system "jekyll build --source=#{dir} --destination=#{dir}/_site > /dev/null"
    $stderr.puts 'Error running jekyll, see build log for details'
    exit 1
  end
end


def get_doc_contents
  source_dir = CONFIG[:source_dir]
  tmp_dir = CONFIG[:tmp_dir]
  formatter = REXML::Formatters::Default.new
  toc = YAML::load_file("#{source_dir}/_data/_nav.yml")
  doc_content = []

  toc["reference"].each do |toc_data|
    section = {
        'id' => ERB::Util.url_encode(toc_data['title'].sub(' ', '_')),
        'title' => toc_data['title'],
        'content' => []
    }

    if toc_data["content"]
      toc_data['content'].each do |item|
        item.each do |file_path, title|
          puts "Processing #{file_path}"

          file_path = "#{tmp_dir}/_site/#{file_path}"
          file_basename = Pathname.new(file_path).basename

          if File.file?(file_path) == false
            next
          end

          page_content = File.read(file_path)
          page = {
              'id' => file_basename,
              'title' => title,
          }

          doc = REXML::Document.new page_content

          # Add pageid prefixes to all nodes
          doc.elements.each("//*[@id]") do |node|
            node_id = node.attributes['id']
            node.attributes['id'] = "#{page['id']}_#{node_id}"
          end

          # Resolving links and anchors
          doc.elements.each("//a[@href]") do |link|
            link_href = CGI.escape(link.attributes['href'])
            uri = URI.parse(link_href)

            # Local link
            if uri.scheme == nil
              new_anchor_id = link_href

              # Anchor
              if link_href.match(/^#/)
                new_anchor_id = "#{page['id']}_#{uri.fragment}"
                # Link to another page
              else
                new_anchor_id = "#{uri.path}" + ((uri.fragment != nil) ? "_#{uri.fragment}" : "")
              end

              link.attributes['href'] = "#" + new_anchor_id
            end
          end

          # Find empty links
          doc.elements.each("//a[count(child::node())=0]") do |link|
            link.add_text ' '
          end

          # Rename all headings to lower level
          5.downto(1) do |i|
            doc.elements.each("//h#{i}") do |node|
              node_name = node.name
              node.name = "h#{i + 1}"
            end
          end

          out = String.new
          doc.elements.each("//body/*") do |node|
            formatter.write(node, out)
          end

          page['content'] = out
          section['content'].push(page)
        end
      end

    end

    doc_content.push(section)
  end

  doc_content
end