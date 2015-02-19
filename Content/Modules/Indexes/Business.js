function InitialBusniessContainer()
{
    $(".CitySearchPane").hide();
    $(".BackBtnPane").show();
}

$(document).on("click", ".BackBtnPane", function () {
    $(".CitySearchPane").show();
    $(".BackBtnPane").hide();
});