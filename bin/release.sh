#!/usr/bin/env bash
set -e

type=${1:-patch}
npm version -m "feat(release): %s" ${type}
