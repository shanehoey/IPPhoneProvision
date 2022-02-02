/* 
 * Phone Provision 
 * Shane Hoey
 * https://github.com/shanehoey/phoneprovision
 */

console.clear();

const express = require('express'),
      https = require('https'),
      helmet = require('helmet'),
      app = express(),
      common = require('./common');

app.use(helmet());  

///////////////////////////////////////////////////////
// Debug
///////////////////////////////////////////////////////

app.get('/debug/', common.staticUserAuth, (req, res) => {
    common.debugrequest(req,res);
});

// firmware
app.get('/debug/:folder(firmware)/:type(teams|sfb|sfbo|generic|broadsoft|genesys|default)?/?(:hardware.:ext(zip|img))?', common.staticUserAuth, (req, res) => {
    common.debugfirmwarerequest(req,res);
});
// config 
app.get('/debug/:folder(config)/:macaddress.:ext(cfg)',common.staticUserAuth, (req, res) => {
    common.debugconfigrequest(req,res);
});
// static 
// TODO : need to create something that can show all the files 
app.get('/debug/:folder(static)/',common.staticUserAuth, (req, res) => {
    common.debugfirmwarestaticrequest(req,res);
});

///////////////////////////////////////////////////////
// Config
///////////////////////////////////////////////////////

//app.use('/config',express.static('files/config',{ index: false, maxAge: '0', redirect: false, setHeaders: function (res, path, stat) { res.set('x-phoneprovision','staticconfig') }}));
app.use('/config',express.static('files/config',{ setHeaders: function (res, path, stat) { res.set('x-phoneprovision','staticconfig') }}));

app.get('/:folder(config)?/:file.:ext(cfg)', (req, res) => {
    common.configrequest(req,res);
});

///////////////////////////////////////////////////////
// Firmware
///////////////////////////////////////////////////////

app.use('/firmware',express.static('files/firmware',{ setHeaders: function (res, path, stat) { res.set('x-phoneprovision','staticfirmware') }}));

app.get('/:type(teams|sfb|sfbo|generic|broadsoft|genesys)?/:hardware.:ext(zip|img)', (req, res) => {
    common.log("/:type(teams|sfb|sfbo|generic|broadsoft|genesys)?/:hardware.:ext(zip|img)","dev");
    common.log(req.originalUrl,req.method);
    common.firmwarerequest(req,res);
});

app.get('/:override(home|team|branch|auroz)?/:hardware.:ext(zip|img)', (req, res) => {
    common.log("/:override(home|team|branch|auroz)?/:hardware.:ext(zip|img)","dev");
    common.log(req.originalUrl,req.method);
    common.firmwarerequestoverride(req,res);
});

///////////////////////////////////////////////////////

// 404
app.use(function(req, res, next) {
    common.log( `${req.originalUrl} -> 404 Not Found`,"dev"); 
    common.log(req.originalUrl,"404");
    console.log();
    res.set('Cache-control','no-store').set('x-phoneprovision','not found').status(404).send();
});

// Start Web Server

common.log("phoneprovision.js","dev");

if( process.env.NODE_ENV !== "production" ){
    //console.log();
    //common.log("Lorem ipsum dolor sit amet","error");
    //common.log("Lorem ipsum dolor sit amet","warning");
    //common.log("Lorem ipsum dolor sit amet","info");
    //common.log("Lorem ipsum dolor sit amet","PhoneProvision");
    //common.log("Lorem ipsum dolor sit amet","");
    //common.log("Lorem ipsum dolor sit amet");
    //common.log("Lorem ipsum dolor sit amet","dev");
    //console.log();
};

// start web server
const server = https.createServer(common.cert,app)
    .listen(common.port, () => { 
        console.log();
        common.log( `${common.port}`,"Listening -> " );
        console.log();
});