let express = require('express');
router = module.exports = express.Router();

// debug
router.get('/', function (req, res) {
    res.status(200).send(req.headers);
    console.info('200 - ' + req.url + " - " + req.get('user-agent'));
});

// debug/headers
router.get('/headers/', function (req, res) {
    res.status(200).send(req.headers);
    console.info('200 - ' + req.url + " - " + req.get('user-agent'));
});

// debug/body
router.get('/body/', function (req, res) {
    res.status(200).send(req.body);
    console.info('200 - ' + req.url + " - " + req.get('user-agent'));
});

// debug/route
router.get('/route/', function (req, res) {
    res.status(200).send(req.route);
    console.info('200 - ' + req.url + " - " + req.get('user-agent'));
});
