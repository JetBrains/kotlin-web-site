require 'rubygems'
require 'yaml'

CONFIG = {
  :source_dir => __dir__,
  :tmp_dir => "#{__dir__}/__tmp",
  :build_destination => "_site",
  :preview_host => "0.0.0.0",
  :default_env => 'dev',
  :preview_port => 4000,
  :pdf_filename => "kotlin-docs.pdf"
}

Dir['_rake/*.rake'].each { |r| load r }
Dir['_rake/lib/*.rb'].each { |r| load r }


task :default do
  system('rake -T')
end


def ask(message, valid_options)
  if valid_options
    answer = get_stdin("#{message} #{valid_options.to_s.gsub(/"/, '').gsub(/, /,'/')} ") while !valid_options.include?(answer)
  else
    answer = get_stdin(message)
  end
  answer
end


def get_stdin(message)
  print message
  STDIN.gets.chomp
end


def render_erb(template, data = {})
  vars = ErbBinding.new(data)

  template_contents = File.read(template)
  erb = ERB.new(template_contents)
  vars_binding = vars.send(:get_binding)

  erb.result(vars_binding)
end
