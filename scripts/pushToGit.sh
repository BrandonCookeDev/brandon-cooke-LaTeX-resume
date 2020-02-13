#!/bin/bash
CURDIR=$(pwd)
BASEDIR=$(dirname $0)

cd $BASEDIR
git status
git add .
git commit -m 'updated bcooke resume via CICD pipeline'
git push origin master
cd $CURDIR