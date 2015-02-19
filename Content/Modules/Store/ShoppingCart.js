(function (sc, $, undefined) {

    var crtFromCookie = $.cookie('ShoppingCart',{path:'/'});
    if(crtFromCookie)
        crtFromCookie = crtFromCookie.replace(/~/g,'null,');
    var Cart = JSON.parse(crtFromCookie) || {products:[], total:0};

    sc.setProduct = function(prod){
        if(prod.quantity <= 0 && Cart.products[prod._id])
            delete Cart.products[prod._id];
        else if(prod.quantity > 0){
            prodPrice(prod);
             Cart.products[prod._id] = prod;
        }
        ShoppingCart.sum();
        ShoppingCart.save();
        ShoppingCart.render();
    };

    sc.setProdQuantity = function(prodID,qnt){
        Cart.products[prodID].quantity = qnt;
        if(qnt <=0)
              delete Cart.products[prodID];
         ShoppingCart.sum();
        ShoppingCart.save();
        ShoppingCart.render();
        $('#ProdCounter'+prodID).val(qnt);
    };

    function prodPrice(prod){
        // purchase:kg, display:kg
        // purchase:Units, display:Units
        var total = prod.price * prod.quantity;
        // purchase:kg, display:Units
        if( prod.purchase=='kg' && prod.display=='Units')
            total =  ( prod.quantity / prod.unitWeight ) * prod.price;
        // purchase:Units, display:kg
        if( prod.purchase=='Units' && prod.display=='kg')
             total =  ( prod.quantity * prod.unitWeight ) * prod.price;
        
        prod.total = total;
    };

    function setOSProdPrice(prod){
    // purchase:kg, display:kg
    // purchase:Units, display:Units
    var total = prod.price * prod.cartDtl.quantity;
    // purchase:kg, display:Units
    if( prod.cartDtl.purchase=='kg' && prod.display=='Units')
        total =  ( prod.cartDtl.quantity / prod.unitWeight ) * prod.price;
    // purchase:Units, display:kg
    if( prod.cartDtl.purchase=='Units' && prod.display=='kg')
            total =  ( prod.cartDtl.quantity * prod.unitWeight ) * prod.price;
        
    prod.cartDtl.total = total;
};

    function getCart4Server(){
          var c = {};
            for(p in Cart.products){
                var cp = Cart.products[p];
               if (p && cp)
                  c[p] = {_id:cp._id,quantity:cp.quantity,purchase:cp.purchase};
           } 

           return c;
    };


    sc.redirectIfEmpty = function(){
        if( Cart.products.length < 1 ){
            var selector = '.SCEmpty';
            $('#mask').show();
            var winH = $(window).height();
            var winW = $(window).width();
            //Set the popup window to center
            $(selector).css('top',  winH/2-$(selector).height()/2);
            $(selector).css('left', winW/2-$(selector).width()/2);
    
            $(selector).fadeIn(400);
    
            setTimeout(function(){
                ng.Load("/בשרים/בשר-לגריל-ולתנור",{Container:'#Pane'});
                $('#mask').hide();
                },2500);
        }
    };

    sc.sum = function(){
        var total = 0;
        for(p in Cart.products){
           if (p && Cart.products[p])
                total +=  Cart.products[p].total;
        }
        Cart.total = Math.round( total * 100) /100;
    };

    sc.render = function(){
       ng.render('Store/ShoppingCart',Cart,function(htm){
            $('#CartProducts').html(htm);
        });
        $('.cartTextCon').mouseenter(function(){ 
            $($(this).children()[0]).animate({right: '-105px'}, "slow");})
        ;
        $('.cartTextCon').mouseleave(function(){  $($(this).children()[0]).animate({right: '0px'}, "slow");});
    };

    sc.save = function(){
        var s =JSON.stringify(Cart);
        s = s.replace(/null,/g,'~');
        $.cookie('ShoppingCart',s,{path:'/',expires:7});
    };

    var orderSummeryCart = {};
    sc.OpenOrderSummery = function(){
       
        var c = getCart4Server();

       ng.ws("getOrderSummery",c,function(d){
           
           CalcPrices(d);
           orderSummeryCart = d;
           var html = ng.renderer.render('Store/OrderSummery',d);
           $('#OS').html(html);
           openLightBox('#OrderSummery');
           });
    };

    function getOsProductCounter(productID){
     var p = $('#OSProdQnt'+productID).val();
    try{
        p = parseInt(p);
    }
    catch(w){
        p = 1;
    }
    if(p < 0) 
        p = 0;
    $('#OSProdQnt'+productID).val(p);
    return p;
};

    sc.addOSProduct = function(catID,prodID,num){
        var p = getOsProductCounter(prodID);
        p += num;
        $('#OSProdQnt'+prodID).val(p);
        var qnt =  getOsProductCounter(prodID);
        ShoppingCart.setOSProductQuantity(catID,prodID,qnt);
        

    };

    sc.setOSProductQuantity = function(catID,prodID,quantity){
        var c = orderSummeryCart;
        var p = null;
        for(var i=0; i< c.categories[catID].products.length; i++){
            if(c.categories[catID].products[i]._id == prodID){
                p = c.categories[catID].products[i];
                break;
            }
        }
        p.cartDtl.quantity = quantity;
        CalcPrices(c);
       $('#CatTotal'+catID).html(c.categories[catID].total);
       $('#CartTotal').html(c.total);

       ShoppingCart.setProdQuantity(prodID,quantity);
    };

    function CalcPrices(cart){
        cart.total = 0;
        for(c in cart.categories){
            if(c && cart.categories[c]){
                cart.categories[c].total = 0;
                for(p in cart.categories[c].products){
                    var prod = cart.categories[c].products[p];
                    if(p && prod){
                        setOSProdPrice(prod);
                        cart.categories[c].total += prod.cartDtl.total;
                    }
                }
               cart.categories[c].total =  Math.round( cart.categories[c].total * 100) /100
               cart.total += cart.categories[c].total;
            }
        }

        cart.total = Math.round( cart.total * 100) /100
    };

    sc.Init = function(){
      if(isLogedin()){
          $('#User').html($.cookie('name',{path:'/'}));
          $('#cp0').show();
          $('#cp1').hide();
         
          $('#signOut').click(function(){
             $.cookie('email',null,{path:'/'});
             $.cookie('h',null,{path:'/'});
             $.cookie('name',null,{path:'/'});      
             ShoppingCart.Init();
        });
     }
      else{
          $('#User').html('אורח');
          $('#cp0').hide();
          $('#cp1').show();
    }

       var dp = (new Date()).toISOString().split('T') ;
          dt = dp[0].split('-');
          $('#toDate').html( dt[2] +'/' + dt[1] +'/'+ dt[0]);

      ShoppingCart.render();
          for(p in Cart.products){
            if (p && Cart.products[p])
                $('#ProdCounter'+p).val(Cart.products[p].quantity);
        }

       
    };

    sc.Clear = function(){
         Cart = {products:[], total:0};
            ShoppingCart.save();
            orderSummeryCart = {};
        };

    sc.SubmitOrder = function(){
        var dtl = ng.getFormData('Shipping');
        var c = getCart4Server();
        c.dtl = dtl;
        c.dtl.email = $.cookie('email');
        c.dtl.h = $.cookie('h');
        ng.ws("SubmitOrder", c, function(d){
            var cart = d;
            $.cookie('orderID',d._id);
            Cart = {products:[], total:0};
            ShoppingCart.save();
            orderSummeryCart = {};
            ng.render('Order/Confirmation',{cookie:{orderID:d._id}},function(htm){
                $('#Pane').html(htm);
                 $(document).scrollTop(0);
                });
        });
    };

} (window.ShoppingCart = window.ShoppingCart || {}, jQuery));
