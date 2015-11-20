#!/usr/bin/env bash

merge () {
  git co master
  git pull -r
  git co develop
  git rebase master
}

merge
