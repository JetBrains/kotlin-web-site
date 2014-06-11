desc "Runs site on a local webserver, changed files are rebuilt automatically"
task :preview do
  host = ENV["host"] || CONFIG[:preview_host]
  port = ENV["port"] || CONFIG[:preview_port]
  system "jekyll serve --host=#{host} --port=#{port} --watch"
end