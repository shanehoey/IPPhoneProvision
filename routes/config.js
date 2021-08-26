let express = require('express');
router = module.exports = express.Router();
var app = express();

// default config
const { Liquid } = require('liquidjs');
const engine = new Liquid({
    root: `/files/configs/`,
    extname: '.liquid' 
});

// static configs
router.use(express.static('files/configs'));

router.get('/:config', (req, res) => {
    var config = require('../files/json/config.json');
    let result = firmware.find(firmware => firmware.name === req.params.firmware);
    console.log(result.path);
    res.status(200).send(req.route);
 });

router.get('/', function(req, res) {

});
