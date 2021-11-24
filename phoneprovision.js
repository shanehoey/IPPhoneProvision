/* 
 * Phone Provision 
 * Shane Hoey
 * https://github.com/shanehoey/phoneprovision
 */

const express = require('express'),
      https = require('https'),
      helmet = require('helmet'),
      app = express(),
      common = require('./scripts/common');

app.use(helmet());  

// Debug
app.get('/debug/', common.staticUserAuth, (req, res) => {
    common.debugrequest(req,res);
});

// Debug Firmware
app.get('/debug/:folder(firmware)/:type(teams|sfb|sfbo|generic|broadsoft|genesys|default)?/?(:hardware.:ext(zip|img))?', common.staticUserAuth, (req, res) => {
    common.debugfirmwarerequest(req,res);
});

// Debug Config 
app.get('/debug/:folder(config)?/:macaddress.:ext(cfg)',common.staticUserAuth, (req, res) => {
    common.debugconfigrequest(req,res);
});

// Config

app.use('/config',express.static('files/config',{ index: false, maxAge: '0', redirect: false, setHeaders: function (res, path, stat) { res.set('x-phoneprovision','staticconfig') }}));
// check if this will bump from this /\ to that \/

app.get('/:folder(config)?/:file.:ext(cfg)', (req, res) => {
    common.configrequest(req,res);
});



// Firmware

app.use('/firmware',express.static('files/firmware',{ index: false, maxAge: '0', redirect: false, setHeaders: function (res, path, stat) { res.set('x-phoneprovision','static firmware') }}));
// check if this will bump from this /\ to that \/

app.get('/:folder(firmware)?/:type(teams|sfb|sfbo|generic|broadsoft|genesys)?/:hardware.:ext(zip|img)', (req, res) => {
    common.firmwarerequest(req,res);
});


// 404
app.use(function(req, res, next) {
   console.info('404 - ' + req.url + " - " + req.get('user-agent'))
   res.set('Cache-control','no-store').set('x-phoneprovision','not found').status(204).send();
});

// Start Web Server
console.clear();

common.log("loaded phoneprovision.js","dev");

if( process.env.NODE_ENV !== "production" ){
    console.log();
    common.log("Lorem ipsum dolor sit amet","error");
    common.log("Lorem ipsum dolor sit amet","warning");
    common.log("Lorem ipsum dolor sit amet","info");
    common.log("Lorem ipsum dolor sit amet","SimpleDoc");
    common.log("Lorem ipsum dolor sit amet","");
    common.log("Lorem ipsum dolor sit amet");
    common.log("Lorem ipsum dolor sit amet","dev");
    console.log();
};

// start web server
const server = https.createServer(common.cert,app)
    .listen(common.port, () => { 
        common.log( `Listening: ${common.port}` );
});