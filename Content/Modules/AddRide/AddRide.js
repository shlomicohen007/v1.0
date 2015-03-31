var area = '';
function InitAutocomplete(){
    $( ".filterable" ).on( "listviewbeforefilter", function ( e, data ) {
    var $ul = $( this ),
    $input = $( data.input ),
    value = $input.val(),
    html = "";
    $ul.html( "" );
    if ( value && value.length > 1 ) {
        $ul.show();
        $ul.html( "<li></li>" );
        var cities = $('#city-data ul li');
        $.each(cities.toArray(), function ( i, val ) {
             //html += city; //"<li class='destination' id='" + city.id + "'>" + city.city + "</li>";
            var city = $(val).clone(true);
            city.click(function() {
                var selection = $(this).text();
                var input = $(this).closest('div').find('input');
                input.val(selection);
                input.data("cityid", $(this).data().cityid);
                input.data("areaid", $(this).data().areaid);
                $ul.hide();
            });
            $ul.append(city);
        });
    }
});
}

function addRide() {
    if (!ng.validate("Ride"))
    {
        return;
    }
    if ($.cookie('u', { path: '/' }) == 'demo') {
        alert('לא ניתן לבצע פעולות בגרסת דמו');
        return;
    }
    
    var ride = ng.getFormData("Ride");
    ride.srcCity = $('#sourcefilter').data().cityid;
    ride.destCity = $('#destinationfilter').data().cityid;

    ride.srcAreaID = parseInt($('#sourcefilter').data().areaid);
    ride.dstAreaID = parseInt($('#destinationfilter').data().areaid);
    ride.dstCityID = parseInt($('#destinationfilter').data().cityid);
    ride.cityID = parseInt($('#sourcefilter').data().cityid);

    ride.username = $.cookie('username', { path: '/' });
    ride.h = $.cookie('h', { path: '/' });
    ride.companyName = $.cookie('name', { path: '/' });
   
    ng.ws('addRide', ride, function (d) {
        ng.Load('/myrides', { Container: '#Pane' });
    });
}

function  InitDates() {
    $(".DateTxt").datepicker({ dateFormat: 'dd/mm/yy', minDate: new Date() }); 
}

function InitEditRideForm() {
    $('.CompanyNameTitle').html($.cookie('name', { path: '/' }));
    if (ng.QS && ng.QS['rideID']) {
        ng.ws('getRide', ng.QS['rideID'], function (ride) {
            ng.bindForm("Ride", ride);
            filterCities('#srcAreaID', 'citiesDDL');
            filterCities('#dstAreaID', 'destinationCitiesDDL');
            ng.bindForm("Ride", ride);

        });
    }
}


function filterCities(area,cityDDLID) {
    var selectedArea = $(area).val();
    $('#' + cityDDLID).html('<option value="">בחר עיר </option>');
    var cities = $('#cityList option');
    for (var i = 0; i < cities.length; i++) {
        var c = $(cities[i]);
        if (selectedArea == c.data('area')) {
            var htm = $('<div>').append(c.clone()).html();
            htm = htm.replace('ng-city', 'ng-' + $('#' + cityDDLID).attr('ng-add-key') + '-val')
            $('#' + cityDDLID).append(htm);
        }
    }
}