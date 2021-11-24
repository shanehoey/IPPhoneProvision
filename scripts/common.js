
const   path       = require('path'),
        fs         = require('fs'),
        basicAuth  = require('express-basic-auth'),
        version = require( path.join( path.resolve(), '/files/json/version.json' )),
        config = require( path.join( path.resolve(), '/files/json/config.json' )),
        firmware = require( path.join( path.resolve(), '/files/json/firmware.json' ));

module.exports.staticUserAuth = basicAuth({users: {'phone': '35e62d40-ce98-4283-9332-2e61f7a52fed',challenge: false}});
module.exports.cert = ({
    key     : fs.readFileSync( path.join( path.resolve(), '/files/cert/cert.key' )),
    cert    : fs.readFileSync( path.join( path.resolve(), '/files/cert/cert.crt' ))
});
module.exports.port = process.env.PORT || 443;

// Log Functions
module.exports.log = function (msg,status) { 
    if( process.env.NODE_ENV !== "production" ) {
        let chalk = require('chalk');
        process.stdout.write(chalk.green("[Development] "));
        //BUG status.toLowerCase(); does not work 
        switch(status) {
            case "error":
                console.log(chalk.black.bgRed("Error"),msg);
                break;
            case "warning":
                console.log(chalk.black.bgYellow("Warning"),msg);
                break;
            case "info":
                console.log(chalk.yellow("Info"),msg);
                break;
            case undefined:
                console.log(chalk.yellow("Info"),msg);
                break;
            case "":
                console.log(chalk.yellow("Info"),msg);
                break;
            case "dev":
                if( process.env.NODE_ENV !== "production" ) { console.log(chalk.yellowBright(msg),"") };
                break;
            default:
                console.log(chalk.yellow(status),msg);
            };
        } else {
            switch(status) {
                case "dev":
                    break;
                case "":
                    console.log("info","-",msg);
                    break;
                case undefined:
                    console.log("info","-",msg);
                    break;
                default:
                    console.log(status,"-",msg);    
            }
        };
};
//  res.download(path [, filename] [, options] [, fn])

// get config
function getconfig (macaddress){

    var result = config;

    if (macaddress) {
        var result = result.filter( filtered => filtered.macaddress.toLowerCase() === macaddress.toLowerCase() );
    };

    return result;

};

// get firmware
function getfirmware (type,hardware){

    var result = firmware;
    
    if (type) {
        var result = result.filter(filtered => filtered.type.toLowerCase() === type.toLowerCase() );
        if (hardware) {      
            var result = result.filter (filtered => filtered.hardware.toLowerCase() === hardware.toLowerCase() ); 
        };
    };

    return result;
};

function getversion () {
   var result =  version;
   return result;
};

// debug
// /debug/
module.exports.debugrequest = function (req,res) {
    
   
    if(process.env.NODE_ENV !== "production") { var message = [req.method,req.originalUrl,req.ip].join(' ') } else {var message = [req.method,req.originalUrl].join(' ')};

    var result = getversion();

    res.type('json').set('Cache-control','no-store').set('x-phoneprovision','debug').status(200).send(result);

    this.log(message);

};

// debug config request
module.exports.debugconfigrequest = function (req,res){
    
    if (req.params.macaddress) {
        var result = getconfig(req.params.macaddress);
    } else {
        var result = getconfig();
    }

    res.type('json').set('Cache-control','no-store').set('x-phoneprovision','debug').status(200).send(result);
    
    if(process.env.NODE_ENV !== "production") { 
        this.log([req.method,req.originalUrl,req.ip].join(' '));
        this.log(req.params);
        this.log(`{ results: ${result.length}}`);

    } else {
        this.log([req.method,req.originalUrl].join(' '));
    };

};

// debug firmware request
module.exports.debugfirmwarerequest = function (req,res){
    
    var type = req.params.type;
    var hardware = req.params.hardware;
  
    if (type) {
        if (hardware) {
            var result = getfirmware(type,hardware);
        } else {
            var result = getfirmware(type);
        };
    } else {
        var result = getfirmware();
    };


    switch(true) {
        case (result.length >= 1 ):
        {
            res.set('Cache-control','no-store').set('x-phoneprovision','expected').status(200).send(result);
            break;
        }
        default:
        {
            res.set('Cache-control','no-store').set('x-phoneprovision','firmwarenotfound').status(203).send();
        }
    };

    if(process.env.NODE_ENV !== "production") { 
        this.log([req.method,req.originalUrl,req.ip].join(' '));
        this.log(req.params);
        this.log(`{ results: ${result.length}}`);
    } else {
        this.log([req.method,req.originalUrl].join(' '));
    };

};


// config request
// /:folder(config)?/:macaddress.:ext(cfg)
module.exports.configrequest = function (req,res){
    
    if(process.env.NODE_ENV !== "production") { var message = [req.method,req.originalUrl,req.ip].join(' ') } else {var message = [req.method,req.originalUrl].join(' ')};
    
    if (req.params.macaddress) {
        var response = getconfig(req.params.macaddress);
    } else {
        var response = getconfig();
    }

    this.log(`[PhoneProvision] Returned ${response.length} results`);

    res.type('json').set('Cache-control','no-store').set('x-phoneprovision','debug').status(200).send(response);
    
    this.log(message);

};

// firmware request
// /:folder?(firmware)/:type?(teams|sfb|sfbo|generic|broadsoft|genesys)/:hardware.:ext(zip|img)

module.exports.firmwarerequest = function (req,res){
    
    if(process.env.NODE_ENV !== "production") { this.log([req.method,req.originalUrl,req.ip].join(' ')) } else { this.log([req.method,req.originalUrl].join(' ')) };
    
    if (req.params.type) { var result = getfirmware(req.params.type,req.params.hardware); } else { var result = getfirmware("default",req.params.hardware); };

    switch(true) {
        case (result.length == 1 ):
        {
            this.log(result[0].path);
            res.set('Cache-control','no-store').set('x-phoneprovision','firmwarerequest').redirect(301,result[0].path);
            break;
        }
        default:
        {
            this.log(result[0].path);
            res.set('Cache-control','no-store').set('x-phoneprovision','firmwarenotfound').status(203).send();
        }
    };

};


module.exports.firmwarerequestoverride = function (req,res){
    
    if(process.env.NODE_ENV !== "production") { this.log([req.method,req.originalUrl,req.ip].join(' ')) } else { this.log([req.method,req.originalUrl].join(' ')) };
    
    var result = getfirmware(req.params.override,req.params.hardware);

    switch(true) {
        case (result.length == 1 ):
        {
            this.log(result[0].path);
            res.set('Cache-control','no-store').set('x-phoneprovision','firmwarerequest').redirect(301,result[0].path);
            break;
        }
        default:
        {
            this.firmwarerequest(req.res);
        }
    };

};

