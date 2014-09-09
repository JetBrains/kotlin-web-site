desc "Builds the site"
task :build do
  dest = ENV["dest"] || CONFIG[:build_destination]
  env = ENV["env"] || 'dev'

  system "jekyll build --destination=#{dest}"

  if env == 'prod'
    system 'rake build_pdf dest=_site/docs/kotlin-docs.pdf'
  end
end