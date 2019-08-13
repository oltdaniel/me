#!/bin/bash

sed 's/future: true/future: false/g' _config.yml > _config.deploy.yml
bundle exec jekyll b --config _config.deploy.yml
scp -r _site/* root@oltdaniel.at:/var/www/html/
