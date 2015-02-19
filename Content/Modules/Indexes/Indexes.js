function InitialIndexesContainer()
{
    $(".CitySearchPane").show();
    $(".BackBtnPane").hide();    
}

$(document).on("click", ".IndexSideMenu li a", function () {    
    var currentLink = $(this);
    
    $(this).parents("ul").find("li").each(function () {
        $(this).removeClass("SelectedIndex");
    });

    currentLink.parent("li").addClass("SelectedIndex");
});