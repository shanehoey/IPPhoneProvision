# Phone Provision

Provision, config and upgrade AudioCodes IP Phone's using docker container.

Can also be used with other phones eg Poly, Yealink, etc, if you have a request for a specific phone then create an issue.

## Important Pre-requisites

- Certificate Required, Personally I use Lets Encrypt, just load the certificate and private key into \files\cert folder as  cert.pem and cert.key respectively.
- download firmware from AudioCodes website and copy to /files/firmware directory.
- update the /files/json/firmware.json file to match the particular firmware you want downloaded.
- update the /files/json/config.json (see below)
- Modify static configs if required
  - compatible - teams config for 3pip devices.
  - native - config for native teams devices.
  - sfb - sfb config.
  - sip.cfg - sip config.

## Building the Docker image

``` Login to ghcr.io

docker login  ghcr.io -u username 

```

### Build Docker Image

```

docker build . -t ghcr.io/shanehoey/phoneprovision:latest

```

### Push to github container registry

```

docker push ghcr.io/shanehoey/phoneprovision:latest

```

## Troubleshooting

* Make sure that all firmware files are unblocked when you download them 



## Ideas

- TODO: Dynamic URL for config files eg /config/teams/?p=10&a=8

## Release Information

### version

- pre-release March 2021 - Proof of concept demo
- pre-release June 2021 - Minor Updates
- pre-release November 2021 - updated firmware, and additional routes for phone types 
- v1.00 pre-release November 2021 - Ability to do firmware overrids

### Acknowledgements

- [nodejs](https://github.com/nodejs/)
- [liquidjs](https://github.com/liquidjs)
- [express](https://github.com/expressjs)
- [helmet](https://github.com/helmetjs)
