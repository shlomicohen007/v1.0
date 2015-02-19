$(".SearchInput").focus(function() {
        var searchInputValue = $(this).val();
        if(searchInputValue == "חיפוש משתמש")
            $(this).val("");
        else if(searchInputValue == "חיפוש לפי עיר")
            $(this).val("");
        
});

$(".SearchInput").blur(function() {             
        var searchValue = $(this).val();
        var inputID = $(this).attr("id")
        if(searchValue == "" && inputID == "userInput")
            $(this).val("חיפוש משתמש") ;                          
        else if(searchValue == "" && inputID == "cityInput")
            $(this).val("חיפוש לפי עיר")                                    
});

$(".UserSearchIcon").click(function() {
    var userTxt = $(".UserInput").val();
    if(userTxt != "" && userTxt != "חיפוש משתמש")
        SearchUserName(userTxt);
    else
        return false;
});

$(".CitySearchIcon").click(function() {
    var cityTxt = $(".CityInput").val();
    if(cityTxt != "" && cityTxt != "חיפוש לפי עיר")
        SearchCityName(cityTxt);
    else
        return false;
});

function SearchUser(e) {
    if (e.keyCode == 13) {
        var userTxt = $(".UserInput").val();
        if(userTxt != "" && userTxt != "חיפוש משתמש")
            SearchUserName(userTxt);
    }
    else
        return false;
}

function SearchCity(e) {
    if (e.keyCode == 13) {
        var cityTxt = $(".CityInput").val();
        if(cityTxt != "" && cityTxt != "חיפוש לפי עיר")
            SearchCityName(cityTxt);
    }
    else
        return false;
}

function SearchUserName(userTxt)
{
    alert(userTxt);
}

function SearchCityName(cityTxt)
{
    alert(cityTxt);
}