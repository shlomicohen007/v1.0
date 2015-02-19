var ECT = require('ect');
var fs = require('fs');
var tProc = require("./TemplateProcessor").Processor;
var config = require("../settings/config.js");
var root = tProc.GetHtmlTemplates();
var templateCounter = Object.keys(root).length;
var renderer;
var counter = 0;

var host = config.serve.host;
if(config.serve.port != 80)
    host+=":" + config.serve.port;

for(var t in root){
    var cb = (function (templateName) {
        var tName = templateName;
        return function (err, data) {
            if (data.indexOf('\uFEFF') === 0) {
                data = data.substring(1, data.length);
            }
            root[tName] = data.replace("{{host}}", host);
            counter++;
            if (templateCounter == counter) {
                renderer = ECT({ root: root });
                module.exports['Renderer'] = renderer;
                module.exports['Root'] = root;
                if (config.autoPack) {
                    fs.writeFile('./Client/public/Min/Templates.js', 'cbJP(' + JSON.stringify(root) + ')', 'utf8');
                }
            }
        }
    })(t);
    fs.readFile('./Content/Modules/'+t +'.htm','utf8',cb);
    }
