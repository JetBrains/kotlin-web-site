desc "Runs site on a local webserver (args: host; port, env=dev|prod)"
task :preview do
  host = ENV["host"] || CONFIG[:preview_host]
  port = ENV["port"] || CONFIG[:preview_port]
  env = ENV["env"] || CONFIG[:default_env]

  command = "jekyll serve --host=#{host} --port=#{port} --watch --force_polling"

  if env != CONFIG[:default_env]
    env_filename = "_config_#{env}.yml"
    if !File.file?(File.expand_path(env_filename))
      puts "Env file #{env_filename} not found"
      exit(1)
    end

    command += " --config _config.yml,#{env_filename}"
  end

  system command
end