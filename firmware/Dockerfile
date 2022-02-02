FROM scratch as Build

LABEL org.opencontainers.image.name="ghcr.io/shanehoey/phoneprovision:firmware"\
      org.opencontainers.image.title="Phone Provision Firmware Files"\
      org.opencontainers.image.authors="Shane Hoey"\
      org.opencontainers.image.source=https://github.com/shanehoey/phoneprovision

COPY ./broadsoft /firmware/broadsoft

COPY ./generic /firmware/generic

COPY ./genesys /firmware/genesys

COPY ./sfb /firmware/sfb

COPY ./sfbo /firmware/sfbo

COPY ./teams /firmware/teams
