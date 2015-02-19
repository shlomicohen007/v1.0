var Responder = require("./Responder");
var fs = require('fs');

function JsonResponder (){
    }

JsonResponder.prototype = new Responder();

JsonResponder.prototype.GetData = function(templateData,cb,params){
    //{ Responder: 'StaticJson', Path: 'Main/main.json' }
    fs.readFile('./Content/Modules/'+templateData.Path,'utf8',function(err,data){
       
         if (data.indexOf('\uFEFF') === 0) {
                data = data.substring(1, data.length);
            }
         data = data.replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '')
        var d = JSON.parse(data);
        d.Params = params;
           cb(null,d);
        });
    }

module.exports = JsonResponder;