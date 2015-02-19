function SetRowsBG()
{
    $(".RideIDCell").each(function (index) {
        var prevRideID = "";//$(".RideIDCell").eq(index + 1).html();
        var currentRideID = $(this).html();
        
        var currentRowBG = "LightPurple";
        if(index == 0)
        {                        
            $(this).parent("tr").children("td").each(function() {
                $(this).addClass(currentRowBG);
            });
        }
        else
        {

            prevRideID = $(".RideIDCell").eq(index - 1).html();
            //debugger;
            if(prevRideID == currentRideID)
            {
                if($(".RideIDCell").eq(index - 1).hasClass("LightPurple"))
                {
                     $(this).parent("tr").children("td").each(function() {
                            $(this).addClass(currentRowBG);
                     });
                }
            }
            else
            {
                $(".RideIDCell").eq(index - 1).parent("tr").children("td").each(function() {
                    $(this).css("border-bottom", "solid 2px #6E7FAA");
                });

                if(!$(".RideIDCell").eq(index - 1).hasClass("LightPurple"))
                {
                    $(this).parent("tr").children("td").each(function() {
                            $(this).addClass(currentRowBG);
                    });
                }
            }
        }

        

    });
}