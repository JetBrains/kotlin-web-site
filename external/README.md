# External Sources 

The folder contains external repositories that contributes additional pages.

All repositories are included into `external` folder in the project root.
The path MUST be listed in the `.gitignore` to avoid side effects with git repositories mixtures

The following code is used to enable an external in `data/_nav.yml`:
```
  - title: Native
      external:
        path: kotlin-native
        nav: _nav_reference.yml
        base: /docs/reference/native
        repo: https://github.com/JetBrains/kotlin-native
```
where:
`path` is the checkout path under the `external` folder 
`nav` means the file, relative to the `path` with the YAML spec (see blow)  
`base` selects base URL for all resources that are included from the `nav`  
   **NOTE** the base path is REMOVED and re-created on every reload!
`repo` is a string, that is used in warning and informational messages 

The `docker-compose up` command allows running without `externals` checked out.
That is done so to simplify the process for everyone who is working on the
`kotlin-web-site` repo. We ensure that all listed externals are available when 
building the static site ( `build_mode == True`)

The `nav` format is a list of:
```
- md: IMMUTABILITY.md
  url: immutability.html
  title: "Immutability"
```

where
`md` is the name of the original markdown file to include 
`url` is the URL at the resulting site 
`title` is the title 

Those parameters are translated into the `content` element under the original `_nav.yml` file. Thanks to the separated `md` and `url` fields one is able to setup alias names for resources.

## Implementation details
The `flask` site lists filesystem to collect all `.md` files to generate pages for.
The approach is hard to upgrade, and it blocks us from placing externals directly
under `pages` folder. That is why we symlink files at the generation time.
The approach allows fixing URL names for free. The symlink is used to support edit
and reload pattern
 
