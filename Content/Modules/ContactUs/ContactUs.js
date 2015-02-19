
function sendContactUs(){
     if(!ng.validate("ContactUs"))
        return;
        var c = ng.getFormData("ContactUs");
    ng.ws("sendContactUs",c, function(){
            $('.cu1').html('<h2>ההודעה נשלחה בהצלחה</h2>');
        });
}

function initContactUs(){
    ng.watermark("ContactUs");
}