#!/usr/bin/env bash

# Remove the generated folder before each commit so it does not get added to the index
# We can not gitignore the folder because travis-ci does not publish it to npm like its suppose to then

rm -rf lib
