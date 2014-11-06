desc "Builds the site (args: env=dev|prod; dest=/path/to/build)"
task :build do
  dest = ENV["dest"] || CONFIG[:build_destination]
  env = ENV["env"] || CONFIG[:default_env]

  command = "jekyll build --trace --destination=#{dest}"

  if env != CONFIG[:default_env]
    env_filename = "_config_#{env}.yml"
    if !File.file?(File.expand_path(env_filename))
      puts "Env file #{env_filename} not found"
      exit(1)
    end

    command += " --config _config.yml,#{env_filename}"
  end

  system command


  case env
    when 'prod'
      system 'rake build_pdf dest=_site/docs/kotlin-docs.pdf'
  end
end