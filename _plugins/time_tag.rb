module Jekyll
  class TimeTag < Liquid::Tag
    def render(context)
      (Time.now.to_f).to_s.gsub(/\./,'')
    end
  end
end

Liquid::Template.register_tag('time', Jekyll::TimeTag)