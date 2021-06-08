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

// if exists 

// else default 

    //import configs 
    // select model 

    //var template = ";AudioCodes IP Phone Default Provisioning\r\n;provisioning\r\nprovisioning/method={{provisioning}}\r\nprovisioning/period/hourly/hours_interval=1\r\nprovisioning/period/type=HOURLY\r\n;regional settinfs\r\nvoip/regional_settings/selected_country=Australia\r\n;networksettings\r\nnetwork/lan/vlan/mode=Disable\r\n;date\r\nsystem/ntp/enabled=1\r\nnetwork/lan/dhcp/ntp/server_list/enabled=1\r\nnetwork/lan/dhcp/ntp/gmt_offset/enabled=0\r\nsystem/ntp/gmt_offset=+10:00\r\nsystem/ntp/primary_server_address=pool.ntp.org\r\nsystem/ntp/secondary_server_address=Disable\r\nsystem/ntp/sync_time/days=0\r\nsystem/ntp/sync_time/hours=1\r\nsystem/ntp/date_display_format=EUROPEAN\r\nsystem/ntp/time_display_format=24HOUR\r\n;telnet\r\nmanagement/telnet/enabled=1";
    //var data = { provisioning : provisioning};
   
    //engine
    //    .parseAndRender(template, data)
    //    .then((result) => {
    //        console.log(result);
    //        res.write(result);
    //        res.end();
    //});

});
