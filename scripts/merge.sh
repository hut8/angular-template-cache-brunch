#!/usr/bin/env bash
set -e

merge () {
  git co master
  git pull -r
  git co develop
  git rebase master
}

merge
