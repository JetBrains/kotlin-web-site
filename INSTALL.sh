#!/bin/bash
RUBY_VERSION_=`ruby -e "puts RUBY_VERSION"`
BUNDLER_VERSION_=1.6.2
GEM_LOCAL_PATH_=~/.gem/ruby/$RUBY_VERSION_/gems
LOCAL_BUNDLER_PATH_=$GEM_LOCAL_PATH_/bundler-$BUNDLER_VERSION_
BUNDLER_PATH=`which bundle` || "$LOCAL_BUNDLER_PATH_/bin/bundle"

if which ruby >/dev/null && which gem >/dev/null; then

    if [[ $OSTYPE == "darwin"* && `which gcc` == "" ]]; then
        echo "You need to install Command Line Developer Tools. Use the following instructions - http://stackoverflow.com/a/9329325"
        exit 0
    fi

    if [ ! -f $BUNDLER_PATH ]; then
       ARCHFLAGS=-Wno-error=unused-command-line-argument-hard-error-in-future gem install bundler --version $BUNDLER_VERSION_ --user-install --no-document
    fi

    $BUNDLER_PATH install --path vendor/bundle
else
    echo "You need Ruby (>= 1.9.3) and rubygems to get it working"
fi
