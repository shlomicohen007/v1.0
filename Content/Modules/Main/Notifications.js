
var unread = 0;
var isNotificationInit = false
function initNotifications() {
    //if (isNotificationInit)
    //    return;
    $(document).ready(function () {
        setTimeout(function () {
            isNotificationInit = true;
            getAllNotifications();
            getchat2allHistory();
        }, 500);
    });
}

function getAllNotifications() {
    ng.ws('getUnreadNotificationCount', $.cookie('username', { path: '/' }), function (c) {
        unread = c;
        if (c > 0)
            $('.msgCount').html(c).show();
        else
            $('.msgCount').html(c).hide();
    });

    $('.Notify').click(function () {
        $('#NotificationBoard').show(400);
        ng.ws('getNotifications', $.cookie('username', { path: '/' }), function (notifications) {
            var h = '';
            for (var i = 0; i < notifications.length; i++) {
                h += notificationFotmat[notifications[i].type](notifications[i]);
            }
            $('.Notifications').html(h);
        });
    });
}

function getNotificationOpenr(notification) {
    var html = '<div class="notificationBox';
    if (notification.read)
        html += ' read';
    html    += '" ';
  
    return html;
}

var notificationFotmat = {
    RequestChat: function (n) {
        var h = getNotificationOpenr(n);
        h += ' onclick="$(\'#NotificationBoard\').hide(); openRquestNotification(' + n.rideID + ',\'' + n.from + '\'); " >';
        h += '<div class="RequestChatIcon"></div>' + n.senderName + ' שלח הודעה בצט' + ' <span>' + n.msg + '</span>';
        h += '</div>'
        return h;
    },
    Chat: function (n) {
        var h = getNotificationOpenr(n);
        h += ' onclick="$(\'#NotificationBoard\').hide(); openHPNotification(' + n.rideID + ',\'' + n.from + '\'); " >';
        h += '<div class="hpChatIcon"></div>' + n.senderName + ' שלח הודעה בצט' + ' <span>' + n.msg + '</span>';
        h += '</div>'
        return h;
    },
    RideApproved: function (n) {
    var h = getNotificationOpenr(n);
    h += ' onclick="$(\'#NotificationBoard\').hide(); openRquestNotification(' + n.rideID + ',\'' + n.from + '\'); " >';
    h += '<div class="RequestChatIcon"></div>' + n.senderName + ' אישר את מחיר הנסיעה' ;
    h += '</div>'
    return h;
    },
    PriceDeclined: function (n) {
        var h = getNotificationOpenr(n);
        h += ' onclick="$(\'#NotificationBoard\').hide(); openRquestNotification(' + n.rideID + ',\'' + n.from + '\'); " >';
        h += '<div class="RequestChatIcon"></div>' + n.senderName + ' סרב למחיר הנסיעה' ;
        h += '</div>'
        return h;
    },
    updateRidePrice: function (n) {
        var h = getNotificationOpenr(n);
        h += ' onclick="$(\'#NotificationBoard\').hide(); openHPNotification(' + n.rideID + ',\'' + n.from + '\'); " >';
        h += '<div class="RequestChatIcon"></div>' + n.senderName + ' הציע מחיר לנסיעה' ;
        h += '</div>'
        return h;
    }
    ,
    ownerApprovedAgreement : function (n) {
    var h = getNotificationOpenr(n);
    h += ' onclick="$(\'#NotificationBoard\').hide(); openUCRNotification(' + n.rideID + ',\'' + n.from + '\'); " >';
    h += '<div class="RequestChatIcon"></div>' + n.senderName + ' אישר את הסכם הנסיעה';
    h += '</div>'
    return h;
}
};

function notifyRead(msg) {
    ng.ws('notifyRead', msg, function (d) { });
    unread--;
    if (unread > 0)
        $('.msgCount').html(unread).show();
    else
        $('.msgCount').html(unread).hide();
}
