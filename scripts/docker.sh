#!/bin/bash
CURDIR=$(pwd)
BASEDIR=$(dirname $0)/..
IMAGE_NAME=resume-latex

cd $BASEDIR
docker build -t $IMAGE_NAME .
docker images
docker run \
	--mount type=bind,source=$(pwd)/,target=/ $IMAGE_NAME
cd $CURDIR
