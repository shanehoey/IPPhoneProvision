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
      certificate = fs.readFileSync('./files/cert/cert.crt'),
      firmwareRouter = require('./routes/firmware'),
      configRouter =require('./routes/config'),
      debugRouter =require('./routes/debug'),
      dhcpRouter =require('./routes/dhcp'),
      genericRouter =require('./routes/generic'),
      sfboRouter =require('./routes/sfbo'),
      sfbRouter =require('./routes/sfb'),
      teamsRouter =require('./routes/teams'),    
      cert = { key: privatekey,cert: certificate};

const server = https.createServer(cert,app)
   .listen(port, () => { 
       console.info(`listening:${port}`); 
   }               
);

app.use(helmet());  

// Router
app.use('/firmware/', firmwareRouter);
app.use('/config/', configRouter);
app.use('/debug/', debugRouter);
app.use('/dhcpupdate', dhcpRouter);
app.use('/dhcp', dhcpRouter);
app.use('/generic', genericRouter);
app.use('/sfbo', sfboRouter);
app.use('/sfb', sfbRouter);
app.use('/teams', teamsRouter);

// catch 404
app.use(function(req, res, next) {
   console.info('404 - ' + req.url + " - " + req.get('user-agent'))
   res.status(404).send();
});
