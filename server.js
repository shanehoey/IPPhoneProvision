/* 
 * Phone Provision 
 * Shane Hoey
 * https://github.com/shanehoey/phoneprovision
 */

const express = require('express'),
      https = require('https'),
      fs = require('fs'),
      helmet = require('helmet'),
      app = express(),
      port = process.env.PORT || 443;

//  App Defaults
const privatekey = fs.readFileSync('./files/cert/cert.key'),
      certificate = fs.readFileSync('./files/cert/cert.pem'),
      firmwareRouter = require('./routes/firmware'),
      configRouter =require('./routes/config'),
      debugRouter =require('./routes/debug'),
      cert = { key: privatekey,cert: certificate};

const server = https.createServer(cert,app)
   .listen(port, () => { 
       console.info(`listening:${port}`); 
   }               
);

app.use(helmet());  

//case insensitive req.query
//app.use((req, res, next) => {
//   req.query = new Proxy(req.query, {
//     get: (target, name) => target[Object.keys(target)
//       .find(key => key.toLowerCase() === name.toLowerCase())]
//  })
//  next();
// });

// Router
app.use('/firmware/', firmwareRouter);
app.use('/config/', configRouter);
app.use('/debug/', debugRouter);

// catch 404
app.use(function(req, res, next) {
   console.info('404 - ' + req.url + " - " + req.get('user-agent'))
   res.status(404).send();
});


