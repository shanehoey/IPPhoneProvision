/* 
 * Phone Provision 
 * server.js 
 * version 1.0.0
 * Shane Hoey
 */

var express = require('express');
var https = require('https');
var fs = require('fs');
var helmet = require('helmet');
const app = express();
app.use(helmet());

//  App Defaults
var privatekey = fs.readFileSync('./files/cert/cert.key');
var certificate = fs.readFileSync('./files/cert/cert.pem');
var firmwareRouter = require('./routes/firmware')
var configRouter =require('./routes/config')
var debugRouter =require('./routes/debug')

const port = process.env.PORT || 443;

var cert = {
   key: privatekey,
   cert: certificate
};
  
const server = https.createServer(cert,app)
   .listen(port, () => { 
       console.info(`listening:${port}`); 
   }               
);

//case insensitive req.query
//app.use((req, res, next) => {
//   req.query = new Proxy(req.query, {
//     get: (target, name) => target[Object.keys(target)
//       .find(key => key.toLowerCase() === name.toLowerCase())]
//  })
//  next();
// });

// firmware files Router
app.use('/firmware/', firmwareRouter);

// configs Router
app.use('/config/', configRouter);

// configs Router
app.use('/debug/', debugRouter);

// catch 404
app.use(function(req, res, next) {
   console.info('404 - ' + req.url + " - " + req.get('user-agent'))
   res.status(404).send();
});


