desc "Builds the site"
task :build do
  dest = ENV["dest"] || CONFIG[:build_destination]
  system "jekyll build --destination=#{dest}"
end