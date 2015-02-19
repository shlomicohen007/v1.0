

    (function (admin, $, undefined) {
    var aCompany;
    admin.updateBusCompanyDtl = function () {
        if (!ng.validate("Company"))
            return;
        aCompany.dtl = ng.getFormData("Company");

        ng.ws('updateBusCompanyDtl', aCompany, function (d) {
            $('.AddCompanyProfileBtn').fadeOut(0);
            $('.SuccessMsg').fadeIn(800);
            setTimeout(function () {
                $('.AddCompanyProfileBtn').fadeIn(800);
                $('.SuccessMsg').fadeOut(0);
            }, 2500);
        });
    };

    admin.getBusCompanyDtl = function () {

        ng.ws('getBusCompany', parseInt(ng.QS['busCompanyID']), function (data) {
            aCompany = data;
            var c = aCompany.dtl || aCompany;
            ng.bindForm('Company', c);
        });
    };

    admin.setRequired = function (el) {
        if ($(el).prop('checked')) {
            $('.CalMember').attr('ng-validate', 'required');
        } else {
            $('.CalMember').attr('ng-validate', '');
        }
    };
    })(window.admin = window.admin || {}, jQuery)