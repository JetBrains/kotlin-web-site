desc "Generates last version file"
task :generate_version_file do
  require 'yaml'
  
  srcdir = CONFIG[:source_dir]
  version_file_path = "#{srcdir}/latest_release_version.txt"

  releases = YAML::load_file("#{srcdir}/_data/releases.yml")
  latest_version = releases['latest']['version']

  res = File.write("#{version_file_path}", latest_version)
  puts "Version info file successfully created in #{version_file_path}" if res
end