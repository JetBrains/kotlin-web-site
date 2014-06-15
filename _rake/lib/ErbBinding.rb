require 'ostruct'
require 'erb'

class ErbBinding < OpenStruct
  def get_binding
    return binding()
  end
end