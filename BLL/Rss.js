var fs = require('fs'),
 XML = require('xml-simple');
var request = require("request");


var rss = {
    getRss: function (cb) {

        request({
            url: 'http://rcs.mako.co.il/rss/31750a2610f26110VgnVCM1000005201000aRCRD.xml'
        }, function (error, response, body) {
            XML.parse(body, function (e, parsed) {
                if (parsed)
                    cb(e, { res: parsed.channel.item });
                else
                    cb(e, null);
            })
        });

    }
};
module.exports = rss;