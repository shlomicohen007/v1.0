function SaveBusiness() {
    if (!ng.validate("Business"))
        return;
    var business = ng.getFormData("Business");
    
    ng.ws('saveBusiness', business, function (d) {
        //alert("Save");
        $(".SaveMsg").html("העסק נשמר בהצלחה");
        //ng.Load('/myrides', { Container: '#Pane' });
    });
}