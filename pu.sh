#!/bin/bash

sed 's/future: true/future: false/g' _config.dev.yml > _config.yml
bundle exec jekyll b
for f in $(find _site -name "*.html" -type f); do
    htmlbeautifier "$f"
    echo "$f"
done
