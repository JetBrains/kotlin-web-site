desc "Runs site on a local webserver, changed files are rebuilt automatically"
task :preview do
  host = ENV["host"] || CONFIG[:preview_host]
  port = ENV["port"] || CONFIG[:preview_port]
  system "jekyll serve --host=0.0.0.0 --port=#{port} --watch --force_polling"
end