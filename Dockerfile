FROM node:14-alpine

RUN apk update && apk add ffmpeg python3 py-pip && pip install s3cmd && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

# install dependencies
RUN yarn --frozen-lockfile

# Ensure that .dockerignore includes node_modules
COPY . .
