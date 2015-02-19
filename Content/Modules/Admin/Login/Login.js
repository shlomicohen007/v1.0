


function adminLogin(){
    if(!ng.validate("Login"))
        return;
    var l = ng.getFormData("Login");
     ng.ws('adminLogin',l,function(d){
         if(!d){
             $('#logErrMsg').show();
        }
         else{
             $('#logErrMsg').hide()
           
             $.cookie('aEmail',d.email,{path:'/'});
             $.cookie('aH',d.hash,{path:'/'});
             $.cookie('aName',d.firstName,{path:'/'});


           ng.Load('/admin/orders',{Container:'#Pane',ScrollTop:true});
           
        }
    });
}

function displayLogout(){
    $('#HeaderText').html('שלום ' + $.cookie('aName',{path:'/'}) +  ' <a href="javascript://" onclick="logout();" >יציאה</a>');
}

function logout(){
    $.cookie('aEmail',null,{path:'/'});
    $.cookie('aH',null,{path:'/'});
    $.cookie('aName',null,{path:'/'});  
    ng.Load('/admin/',{Container:'#Pane',ScrollTop:true});
    $('#HeaderText').html('');
}
