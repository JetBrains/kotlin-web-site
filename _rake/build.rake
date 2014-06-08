desc "Builds the site"
task :build do
  dest = ENV["dest"] || CONFIG[:build_destination]
  system "#{CONFIG[:source_dir]}/bin/jekyll build --destination=#{dest}"
end