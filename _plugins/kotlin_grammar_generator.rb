require 'rexml/document'


module KotlinGrammar
  class Generator < Jekyll::Generator
    def generate(site)
      file_path = "#{File.dirname(__FILE__)}/../#{site.config['grammar_file_path']}"

      unless File.file?(file_path)
        return nil
      end

      data = []
      file_contents = File.read(file_path)
      doc = REXML::Document.new file_contents
      grammar_page = site.pages.detect {|page| page.name.downcase.split('.')[0] == 'grammar'}

      # set
      doc.elements.each('/tokens/set') do |node|
        set = {
            'file-name' => node.attributes['file-name'],
            'content' => []
        }

        node.elements.each('./*') do |node|
          case node.name
            # comment
            when 'comment'
              set['content'].push({'type' => 'comment', 'content' => node.text})

            # item
            when 'item'
              item = {'type' => 'item', 'content' => []}

              node.elements.each('./*') do |node|
                case node.name
                  # annotation
                  when 'annotation'
                    item['content'].push({'type' => 'annotation', 'content' => node.text})

                  # declaration
                  when 'declaration'
                    declaration = {
                        'type' => 'declaration',
                        'name' => node.attributes['name'],
                        'usages' => []
                    }

                    # declaration usages
                    node.elements.each('./usages/declaration') do |node|
                      declaration['usages'].push({
                                                     'name' => node.text,
                                                 })
                    end

                    item['content'].push(declaration)

                  # declaration description
                  when 'description'
                    description = {'type' => 'description', 'content' => []}

                    node.elements.each('./*') do |node|
                      token = {}

                      case node.name
                        when 'whiteSpace'
                          token['type'] = 'whitespace'
                          token['crlf'] = node.attributes['crlf'] == 'true'

                        when 'identifier'
                          token['type'] = 'identifier'
                          token['name'] = node.attributes['name']

                        when 'string', 'symbol', 'other'
                          token['type'] = node.name
                          token['content'] = node.text
                      end

                      description['content'].push(token)
                    end

                    item['content'].push(description)
                end

              end

              set['content'].push(item)
          end

        end

        data.push(set)
      end

      grammar_page.data['kotlinGrammar'] = data
    end
  end
end