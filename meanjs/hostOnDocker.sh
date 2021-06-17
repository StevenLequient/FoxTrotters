#!/bin/bash
VERSION="1.0.0.${BUILD_NUMBER:-99}"
IMAGE=[your-username]/node-sample
ID=$(docker build  -t ${IMAGE}  .  | tail -1 | sed 's/.*Successfully built \(.*\)$/\1/')

docker tag ${ID} ${IMAGE}:${VERSION}
docker tag ${ID} ${IMAGE}:latest

docker login -u [your-username] -p [your-password] -e [your-email]

docker push ${IMAGE}:${VERSION}
docker push ${IMAGE}:latest