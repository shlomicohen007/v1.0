

function payCalEnd(tid) {
    var rideID = ng.QS["rideID"];
    var to = ng.QS["t"];
    
    ng.ws('PayByCal', { rideID: rideID, to:to,tid: tid });
}
