#!/bin/bash

bundle exec jekyll b
scp -r _site/* root@oltdaniel.at:/var/www/html/
