#!/bin/bash
docker run \
	 --mount type=bind,source=$(pwd)/,target=/app/current \
	 resume-latex
