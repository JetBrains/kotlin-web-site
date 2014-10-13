require 'kramdown'

module Kramdown
  module Converter
    class Html
      def convert_header(el, indent)
        attr = el.attr.dup
        if @options[:auto_ids] && !attr['id']
          attr['id'] = generate_id(el.options[:raw_text])
        end
        @toc << [el.options[:level], attr['id'], el.children] if attr['id'] && in_toc?(el)
        level = output_header_level(el.options[:level])

        if level <= 3
          anchor = Element.new(:a, nil, {
              'href' => '#' + attr['id'],
              'class' => 'anchor'
          })
          el.children.push(anchor)
        end

        format_as_block_html("h#{level}", attr, inner(el, indent), indent)
      end

    end
  end
end