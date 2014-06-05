desc "On-fly site preview"
task :preview do
  host = ENV['host'] || CONFIG["site_host"]
  sh "jekyll serve --host=#{host} --watch"
end