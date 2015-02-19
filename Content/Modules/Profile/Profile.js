var company;
function updateBusCompanyDtl() {
    if (!ng.validate("Company"))
        return;
    company.dtl = ng.getFormData("Company");
   
    ng.ws('updateBusCompanyDtl', company, function (d) {
        $('.AddCompanyProfileBtn').fadeOut(0);
        $('.SuccessMsg').fadeIn(800);
        setTimeout(function () {
            $('.AddCompanyProfileBtn').fadeIn(800);
            $('.SuccessMsg').fadeOut(0);
        }, 2500);
    });
}

function getBusCompanyDtl() {
    ng.ws('getBusCompanyDtl', { username: $.cookie('username', { path: '/' }), h: $.cookie('h', { path: '/' }) }, function (data) {
        company = data;
        var c = company.dtl || company;
        ng.bindForm('Company', c);
    });
}