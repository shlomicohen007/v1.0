var Responder = require("./Responder");
var dal = require("../dal").instance;
var config = require("../../Settings/config.js");

var urlLib = require("url");

function AgreementResponder (request,response){
    this.request = request;
    this.response = response;
    this.url = urlLib.parse(request.url,true);
    this.params = {};
    }

AgreementResponder.prototype = new Responder();

AgreementResponder.prototype.GetData = function (templateData, cb, params) {
    var rideID = this.url.query["rideID"];
    dal.findOne('Rides', { _id: parseInt(rideID) }, {}, function (err, d) {
        r = d;
        if(r.requests[r.soldTo])
            r.price = r.requests[r.soldTo].price;
        delete r.requests;

        dal.findOne('BusCompany', { _id: r.companyID }, { dtl: 1 }, function (err2, c) {
            r.owner = c.dtl;
            dal.findOne('BusCompany', { _id: parseInt(r.soldTo) }, { dtl: 1 }, function (err3, cus) {
                r.customer = cus.dtl;
                cb(err, r);
            });
        });
    });
}


module.exports = AgreementResponder;