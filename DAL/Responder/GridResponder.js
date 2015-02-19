var Responder = require("./Responder");
var DBFindResponder = require("./DBFindResponder.js");

function GridResponder (request,response){
    this.request = request;
    this.response = response;
   
    this.DBFind = new DBFindResponder(request,response);
    

}


GridResponder.prototype = new Responder();

GridResponder.prototype.GetData = function(templateData,cb){
    var t = JSON.parse(JSON.stringify(templateData));
    var cbh = cb;
    this.DBFind.GetData(templateData,function(err,data){
        var d = data;
            d.GridSettings = t.GridSettings;
            cbh(err, d);
        });
};

module.exports = GridResponder;