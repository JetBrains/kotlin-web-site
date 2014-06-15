module Jekyll

  class Page

    def dir
      @dir
    end

  end

  class PageComparer
    attr_reader :slug

    def initialize(name)
      @basename = parse_basename(name)
      @dirname = parse_dirname(name)
    end

    #
    # Find the base filename without the extension if one has been provided.
    #
    def parse_basename(name)
      extension = File.extname(name)
      File.basename(name)[0..-extension.length-1]
    end

    #
    # Find the dirname. When there is no directory ignore the "." directory
    # that is returned.
    #
    def parse_dirname(name)
      dirname = File.dirname(name)
      dirname == "." ? "" : dirname
    end

    #
    # We consider a page to match the specified name if the basenames
    # are the same and some of the page given in the page_url tag has
    # can be found within the directory of the page.
    #
    def matches?(page)
      page.basename == @basename and page.dir.include? @dirname
    end
  end

  class PageUrl < Liquid::Tag
    def initialize(tag_name, page, tokens)
      super
      @original_page = page.strip
      @page = PageComparer.new(@original_page)
    end

    def possible_pages(context)
      @possible_pages ||= context.registers[:site].pages
    end

    def render(context)
      possible_pages(context).each do |page|
        return "#{Jekyll.configuration({})['baseurl']}#{page.url}" if @page.matches? page
      end

      puts "ERROR: page_url: \"#{@original_page}\" could not be found"

      return "#"
    end
  end
end

Liquid::Template.register_tag('page_url', Jekyll::PageUrl)