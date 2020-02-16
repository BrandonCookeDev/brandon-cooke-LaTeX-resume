#!/bin/bash
CURDIR=$(pwd)
BASEDIR=$(dirname $0)/..
IMAGE_NAME=resume-latex

cd $BASEDIR
docker build -t $IMAGE_NAME -f WithNodeModules.Dockerfile .
docker run \
	--mount type=bind,source=$(pwd)/,target=/app $IMAGE_NAME
cd $CURDIR
