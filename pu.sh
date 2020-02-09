#!/bin/bash

sed 's/future: true/future: false/g' _config.yml > _config.deploy.yml
bundle exec jekyll b --config _config.deploy.yml
for f in $(find _site -name "*.html" -type f); do
    htmlbeautifier "$f"
    echo "$f"
done
