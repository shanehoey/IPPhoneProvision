let express = require('express');

// router
router = module.exports = express.Router();

// static
router.use(express.static('files/firmware'));

// default firmware
router.get('/:firmware', (req, res) => {
    
    var firmware = require('../files/json/generic.json');
    let result = firmware.find(firmware => firmware.name.toLowerCase() === req.params.firmware.toLowerCase());
 
    console.info('200        - ' + req.url );
    console.info('REDIRECT   - ' + '/firmware/' + result.path );
    console.info('USER AGENT - ' + req.get('user-agent'));
    res.redirect(301,'/firmware/' + result.path);

 });