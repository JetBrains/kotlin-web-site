if which ruby >/dev/null && which gem >/dev/null; then
    if [[ $OSTYPE == "darwin"* ]]; then
        if [[ `which gcc` == "" ]]; then
            xcode-select --install;
            exit 0
        fi
    fi

    mkdir -p ~/bin
    ARCHFLAGS=-Wno-error=unused-command-line-argument-hard-error-in-future gem install bundler --user-install --no-document --bindir ~/bin
    echo export PATH=\$PATH:\~/bin >> ~/.bashrc
    #exec $SHELL
    ~/bin/bundle install --path vendor/bundle
    ~/bin/bundle binstubs rake
    ~/bin/bundle binstubs jekyll
else
    echo "You need Ruby (>= 1.9.3) and rubygems to get it working"
fi