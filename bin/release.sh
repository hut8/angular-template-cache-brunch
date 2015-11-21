#!/usr/bin/env bash
set -e

# try rebase, if fails then do merge
#it rebase ... || git rebase --abort

merge () {
  git pull -r --tags --quiet origin master
  git co master
  git merge develop
}

script () {
  gulp changelog
  git add -A
}

version () {
  type=${1:-patch}
  mversion -n -m "feat(release): %s" ${type}
}

postversion () {
  git push --follow-tags
  git co develop
  git rebase master
  git push
}


merge
script
version ${1}
postversion
