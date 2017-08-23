FROM node

MAINTAINER Gareth Barlow <gruff@apily.co.uk>

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /gun-server
ADD . .
 
RUN npm install && npm rebuild && rm -rf /var/cache/* -rf /tmp/npm/*

VOLUME  ["/gun-server/data"]

EXPOSE 3272

CMD ["npm","start"]
