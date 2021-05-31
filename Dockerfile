FROM node:slim

LABEL org.opencontainers.image.source=https://github.com/shanehoey/phoneprovision

ENV NODE_ENV=production
ENV DEBIAN_FRONTEND noninteractive
ENV DEBIAN_PRIORITY critical

RUN apt-get -qq update && \
    apt-get clean

RUN mkdir /phoneprovision
WORKDIR  /phoneprovision
COPY ./ /phoneprovision

RUN npm install
 
EXPOSE 443

CMD ["node", "server.js"]
