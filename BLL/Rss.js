var fs = require('fs'),
 XML = require('xml-simple');
var request = require("request");
var windows1255 = require('windows-1255');

var rss = {
    getRss: function (cb) {


        request('http://www.ynet.co.il/Integration/StoryRss1854.xml', function (error, response, body) {
            //var rss = windows1255.decode(body);
            XML.parse(body, function (e, parsed) {
                if (parsed)
                    cb(e, { res: parsed.channel.item });
                else
                    cb(e, null);
            })
        });

        /*fs.readFile('./Content/Modules/RSS/Ynet.xml', function (err, data) {
            //  var rss = windows1255.decode(data);
            XML.parse(data, function (e, parsed) {
                if (parsed)
                    cb(e, { res: parsed.channel.item });
                else
                    cb(e, null);
            })

        });*/

    }
};
module.exports = rss;