
function selectSub(el){
    $('.CategoryMenu li.selected').removeClass('selected');
    $('.selectedCat').removeClass('selectedCat');
    $(el).addClass('selectedCat').parent().parent().addClass('selected');
}

function addGuest(num){
    var g = getGusetCounter();
    g+=num;
    $('#GuestCounter').val(g);
    updateCalc();
}

function getGusetCounter(){
     var guestNumber = $('#GuestCounter').val();
    try{
        guestNumber = parseInt(guestNumber);
    }
    catch(w){
        guestNumber = 8;
    }
    if(guestNumber < 1 || isNaN(guestNumber)) 
        guestNumber =1;
    $('#GuestCounter').val(guestNumber);
    return guestNumber;
}

function updateCalc(){
    var guestNumber = getGusetCounter()
    var meat = 400 * guestNumber;
    var salad = 200 * guestNumber;

    meat = (meat > 1000) ? (meat/1000) + ' ק"ג ' : meat + " גר' " ;
    salad = (salad > 1000) ? (salad/1000) + ' ק"ג ' : salad + " גר' " ;

    $('#CalcMeat').html(meat);
    $('#CalcSalad').html(salad);
}

function getProductCounter(productID){
     var p = $('#ProdCounter'+productID).val();
    try{
        p = parseInt(p);
    }
    catch(w){
        p = 1;
    }
    if(p < 0 || isNaN(p)) 
        p = 0;
    $('#ProdCounter'+productID).val(p);
    return p;
}

function addProduct(productID,num){
   // console.log(productID);
    var p = getProductCounter(productID);
    p += num;
    $('#ProdCounter'+productID).val(p);
    getProductCounter(productID);

    var prod = ng.getFormData('Product'+productID);
    prod._id = productID;

    ShoppingCart.setProduct(prod);
}


function gotoShipping(){
     if(!isLogedin()){
            ng.Load('/login?gts=1',{Container:'#Pane',ScrollTop:true});
    }else{
        ng.Load('/shipping',{Container:'#Pane',ScrollTop:true});
    }

    closeLightBox();
}