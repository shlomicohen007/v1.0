var dal = require("../DAL/dal").instance;

function deleteOldNotification() {
    var rides = {};

    function checkNotification(n) {
        var r = rides[n.rideID];
        if (r && r.aviliableDateObj < new Date() && n.type != 'RideApproved') {
            dal.removeNotification(n);
        }
    }


    dal.getAllNotifications(function (err, nots) {
        for (not in nots) {
            var cn = nots[not];
            if (!rides[cn.rideID])
                (function (n) {
                    dal.findOne('Rides', { _id: n.rideID }, { _id: 1, aviliableDateObj: 1, isApproved: 1, soldTo: 1 }, function (er, ride) {
                        if (!ride) {
                            dal.removeNotification(n);
                        }
                        else {
                            rides[n.rideID] = ride;
                            checkNotification(n);
                        }
                    });
                }(cn));
            else
                checkNotification(cn);
        }
        

    });


}




module.exports.start = function () {

   // dal.fixAviliableDateObj();
    dal.fixUsernames();
    dal.fixDates();

    setTimeout(deleteOldNotification, 6 * 1000); //30sec
    setInterval(deleteOldNotification, 12 * 60 * 1000); // 12H

}