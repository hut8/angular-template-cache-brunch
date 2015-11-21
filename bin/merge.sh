#!/usr/bin/env bash
set -e

# try rebase, if fails then do merge
#it rebase ... || git rebase --abort

merge () {
  git pull -r --tags --quiet origin develop
  git pull -r --tags --quiet origin master
  git co master
  git merge develop
}

merge
