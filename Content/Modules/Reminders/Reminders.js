
function loadCalendar() {
    var today = new Date();
    var y = today.getFullYear();
    var m = today.getMonth();
    
    var SelectedDates = {};  
    ng.ws('getMonthReminders', { username: $.cookie('username', { path: '/' }), year: y, month: (m + 1) }, function (dates) {
        for (var i = 0; i < dates.length; i++) {
            var dp = dates[i].date.split('/');
            SelectedDates[new Date(dp[2], dp[1] - 1, dp[0])] = new Date(dp[2], dp[1] - 1, dp[0]);
        }
        $(".CalenderPane").datepicker({
            dateFormat: 'dd/mm/yy',
            showOtherMonths: true,
            selectOtherMonths: true,
            onSelect: OpenReminders,
            onChangeMonthYear: function (year, month, widget) {
                ng.ws('getMonthReminders', { username: $.cookie('username', { path: '/' }), year: year, month: (month) }, function (dates) {
                    for (var i = 0; i < dates.length; i++) {
                        var dp = dates[i].date.split('/');
                        SelectedDates[new Date(dp[2], dp[1] - 1, dp[0])] = new Date(dp[2], dp[1] - 1, dp[0]);
                    }
                    $(".CalenderPane").datepicker("refresh");

                });
            },
            beforeShowDay: function (date) {
                var Highlight = SelectedDates[date];
                if (Highlight) {
                    return [true, "Highlighted"];
                }
                else {
                    return [true, '', ''];
                }
            }
        });

    });
    
}

var calendarSelectedDate = null ;

function OpenReminders(date) {
    calendarSelectedDate = date;
    ng.ws('getDateReinders', { username: $.cookie('username', { path: '/' }), date: date }, function (reminders) {
        var r = {res:reminders}
        var html = ng.renderer.render('Reminders/Reminders', r);
        $('#reminders').html(html);
        $('.CurrentEventDate').html(date);
        openLightBox('#reminders');

        loadTimeSelects();
    });
}

function saveReminder() {
    var r = $('#reminders2Add').val();
    var time = $("#sHour option:selected").val() + ":" + $("#sMinutes option:selected").val();
    if (!r)
        return;
    ng.ws('saveReminder', { username: $.cookie('username', { path: '/' }), date: calendarSelectedDate, datetime: time, msg: r }, function (reminders) {
        var r = { res: reminders }
        var html = ng.renderer.render('Reminders/Reminders', r);
        $('#reminders').html(html);

        loadTimeSelects();
    });
}

function loadTimeSelects()
{
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 10; j++) {
            $("#sMinutes").append($("<option></option>").val(i.toString() + j.toString()).html(i.toString() + j.toString()));            
        }
    }

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 10; j++) {
            if (i == 2) {
                for (var k = 0; k < 4; k++) {
                    $("#sHour").append($("<option></option>").val(i.toString() + k.toString()).html(i.toString() + k.toString()));                    
                }

                break;
            }
            else {
                $("#sHour").append($("<option></option>").val(i.toString() + j.toString()).html(i.toString() + j.toString()));                
            }
        }
    }
}

$(document).on("click", ".AddEvent", function() {
    
    $(".AddEventForm").slideToggle("slow", function() {
        
    });
});

