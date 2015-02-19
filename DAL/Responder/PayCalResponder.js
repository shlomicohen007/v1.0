var Responder = require("./Responder");
var dal = require("../dal").instance;
var config = require("../../Settings/config.js");

var urlLib = require("url");

function PayCalResponder(request, response) {
    this.request = request;
    this.response = response;
    this.url = urlLib.parse(request.url, true);
    this.params = {};
}

PayCalResponder.prototype = new Responder();

PayCalResponder.prototype.GetData = function (templateData, cb, params) {
    var rideID = this.url.query["rideID"];
    var to = this.url.query["t"];
    dal.findOne('Rides', { _id: parseInt(rideID) }, {}, function (err, d) {
        r = d;
        if (r.requests[to])
            r.price = r.requests[to].price;
        delete r.requests;

        dal.findOne('BusCompany', { _id: r.companyID }, { dtl: 1 }, function (err2, c) {
            r.owner = c.dtl;
            dal.findOne('BusCompany', { _id: parseInt(to) }, { dtl: 1 }, function (err3, cus) {
                r.customer = cus.dtl;
                cb(err, r);
            });
        });
    });
}

module.exports = PayCalResponder;