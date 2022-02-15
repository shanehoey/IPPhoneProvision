/*
 * common.js
 * Shane Hoey
 * https://github.com/shanehoey/phoneprovision
 */

const   path       = require('path'),
        fs         = require('fs'),
        basicAuth  = require('express-basic-auth'),
        version    = [],
        config    = [],
        firmware    = [];

///////////////////////////////////////////////////////
// Log Function
///////////////////////////////////////////////////////
module.exports.log = function (msg,status) { 
    if( process.env.NODE_ENV !== "production" ) {
        let chalk = require('chalk');
        process.stdout.write(chalk.green("[Development] "));
        //BUG status.toLowerCase(); does not work 
        switch(status) {
            case "error":
                console.log(chalk.black.bgRed("Error"),chalk.red(msg));
                break;
            case "warning":
                console.log(chalk.black.bgCyan("***Warning***"),chalk.cyan(msg));
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

this.log("common.js","dev");


///////////////////////////////////////////////////////
// cert
///////////////////////////////////////////////////////
try {
        module.exports.cert = ({
            key     : fs.readFileSync( path.join( path.resolve(), '/files/cert/cert.key' )),
            cert    : fs.readFileSync( path.join( path.resolve(), '/files/cert/cert.crt' ))
        }); 
} 
catch (err) 
{
        module.exports.cert = ({
            key     : fs.readFileSync( path.join( path.resolve(), '/files/cert/selfsigned.key' )),
            cert    : fs.readFileSync( path.join( path.resolve(), '/files/cert/selfsigned.crt' ))
        });
        this.log("Certificate is missing -> using selfsigned certificate -> see readme.md","warning")
}

///////////////////////////////////////////////////////
// Version
///////////////////////////////////////////////////////
try {
module.exports.version = require ( path.join( path.resolve(), '/files/json/version.json' ));
}
catch (err) 
{
    this.log("Version.json is missing -> using default -> see readme.md","warning")
    module.exports.version = [];
}

try {
    module.exports.firmware = require ( path.join( path.resolve(), '/files/json/firmware.json' ));
    }
catch (err) 
{
    this.log("firmware.json is missing -> see readme.md","warning")
    module.exports.firmware = [];
}

try {
    module.exports.config = require ( path.join( path.resolve(), '/files/json/config.json' ));
    }
catch (err) 
{
    this.log("config.json is missing -> see readme.md","warning")
    module.exports.config = [];
}
    
// TODO: move to version.json
module.exports.staticUserAuth = basicAuth({users: {'phone': '35e62d40-ce98-4283-9332-2e61f7a52fed',challenge: false}});

module.exports.port = process.env.PORT || 443;

function getconfig (macaddress){

    var result = config;

    if (macaddress) {
        var result = result.filter( filtered => filtered.macaddress.toLowerCase() === macaddress.toLowerCase() );
    };

    return result;

};

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

   var result =  this.version;

   switch(true) {
        case (result == undefined ):
        {
            return ("version.json not loaded");
            break;
        }
        default:
        {
            return (result);
        }
    };

};

///////////////////////////////////////////////////////
// debug requests
///////////////////////////////////////////////////////

module.exports.debugrequest = function (req,res) {
    this.log("debugrequest","dev");
    this.log([req.method,req.originalUrl,req.ip].join(' '),"info");

    var result = getversion();
    res.type('json').set('Cache-control','no-store').set('x-phoneprovision','debug').status(200).send(result);
    let msg = `${req.method} ${req.originalUrl} ${req.ip}`
};

module.exports.debugconfigrequest = function (req,res){ 

    this.log("debugconfigrequest","dev");
    this.log([req.method,req.originalUrl,req.ip].join(' '),"info");

    if (req.params.macaddress) {
        var result = getconfig(req.params.macaddress);
    } else {
        var result = getconfig();
    };

    switch(true) {
        case (result.length >= 1 ):
        {
            res.type('json').set('Cache-control','no-store').set('x-phoneprovision','debug').status(200).send(result);
            break;
        }
        default:
        {
            res.type('json').set('Cache-control','no-store').set('x-phoneprovision','debug').status(204).send();
        } 
    };

    this.log(JSON.stringify(req.params),"dev");
    this.log(`{"results":"${result.length}"}`,"dev");
 
};

module.exports.debugfirmwarerequest = function (req,res){
    
    this.log("debugfirmwarerequest","dev");
    this.log([req.method,req.originalUrl,req.ip].join(' '),"info");

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


    this.log(JSON.stringify(req.params),"dev");
    this.log(`{"results":"${result.length}"}`,"dev");

};

module.exports.debugfirmwarestaticrequest = function (req,res) {
    
    this.log("debugfirmwarestaticrequest","dev");
    this.log([req.method,req.originalUrl,req.ip].join(' '),"info");

    var result = getversion();

    res.type('json').set('Cache-control','no-store').set('x-phoneprovision','debug').status(200).send(result);

    this.log([req.method,req.originalUrl,req.ip].join(' '));

};

module.exports.debugallfirmwarerequest = function (req,res) {

    this.log("debugfirmwarestaticrequest","dev");
    this.log([req.method,req.originalUrl,req.ip].join(' '),"info");

    const isFile = fileName => {
        return fs.lstatSync(fileName).isFile()
    }
    
    fs.readdirSync(folderPath).map(fileName => {
        return path.join(folderPath, fileName)
    })
    .filter(isFile)
}


///////////////////////////////////////////////////////
// config request
///////////////////////////////////////////////////////

module.exports.configrequest = function (req,res){

    this.log("configrequest","dev");
    this.log([req.method,req.originalUrl,req.ip].join(' '),"info");

    if (req.params.macaddress) {
        var response = getconfig(req.params.macaddress);
    } else {
        var response = getconfig();
    }
    res.type('json').set('Cache-control','no-store').set('x-phoneprovision','debug').status(200).send(response);
    

};

///////////////////////////////////////////////////////
// firmware request
///////////////////////////////////////////////////////

module.exports.firmwarerequest = function (req,res) {
    
    this.log("firmwarerequest","dev");
    this.log([req.method,req.originalUrl,req.ip].join(' '),"info");

    if (req.params.type) { var result = getfirmware(req.params.type,req.params.hardware); } else { var result = getfirmware("default",req.params.hardware); };

    switch(true) {
        case (result.length == 1 ):
        {
            this.log(`${req.originalUrl} -> firmwarerequest -> 301 redirect -> ${result[0].path}`,"dev"); 
            res.set('Cache-control','no-store').set('x-phoneprovision','firmwarerequest').download(path.join( path.resolve(),"files",result[0].path ));
            break;
        }
        default:
        {
            this.log( `${req.originalUrl} -> firmwarerequest -> 404 Not Found`,"dev"); 
            res.set('Cache-control','no-store').set('x-phoneprovision','firmwarenotfound').status(204).send();
        }
    };
    console.log();
};

module.exports.firmwarerequestoverride = function (req,res){

    this.log("firmwarerequestoverride","dev");
    this.log([req.method,req.originalUrl,req.ip].join(' '),"info");
    
    var result = getfirmware(req.params.override,req.params.hardware);

    switch(true) {
        case (result.length == 1 ):
        {
       
            this.log(`${req.originalUrl} -> firmwarerequestoverride -> ${result[0].path} -> firmwarerequest`,"dev"); 
            //res.set('Cache-control','no-store').set('x-phoneprovision','firmwarerequestoverride').redirect(301,result[0].path);
            res.download(path.join( path.resolve(),"files",result[0].path ));
            break;

        }
        default:
        {

            this.log( `${req.originalUrl} -> firmwarerequestoverride -> Override Not found  -> firmwarerequest`,"dev"); 
            this.firmwarerequest(req,res);

        }
    };

};
