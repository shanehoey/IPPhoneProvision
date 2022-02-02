FROM node:slim As build

LABEL org.opencontainers.image.name="ghcr.io/shanehoey/phoneprovision"\
      org.opencontainers.image.title="Phone Provision"\
      org.opencontainers.image.authors="Shane Hoey"\
      org.opencontainers.image.source=https://github.com/shanehoey/phoneprovision

ENV NODE_ENV=production 

RUN mkdir /phoneprovision

WORKDIR  /phoneprovision

COPY ./ /phoneprovision

COPY --from=ghcr.io/shanehoey/phoneprovision:firmware ./firmware/broadsoft ./files/firmware/broadsoft

COPY --from=ghcr.io/shanehoey/phoneprovision:firmware ./firmware/generic ./files/firmware/generic

COPY --from=ghcr.io/shanehoey/phoneprovision:firmware ./firmware/genesys ./files/firmware/genesys

COPY --from=ghcr.io/shanehoey/phoneprovision:firmware ./firmware/sfb ./files/firmware/sfb

COPY --from=ghcr.io/shanehoey/phoneprovision:firmware ./firmware/sfbo ./files/firmware/sfbo

COPY --from=ghcr.io/shanehoey/phoneprovision:firmware ./firmware/teams ./files/firmware/teams
  
RUN apt-get -qq update && \
    apt-get clean

RUN npm install 

EXPOSE 443

CMD ["node", "phoneprovision.js"]
