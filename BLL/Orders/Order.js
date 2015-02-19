var dal = require("../../DAL/dal").instance;

var mailer = require("../Mailer.js");


var o = {
    getSummery: function(cart,cb){
        var c = cart
        var os = {categories:[]};
        dal.getCategories(function(err,categories){
            var cats = categories;
            var cCat = {};
            for(var i=0; i <cats.categories.length; i++){
                var pc = cats.categories[i];
                for(var j=0; j <pc.categories.length; j++ ){
                    cc = pc.categories[j];
                    cCat[cc._id] = pc;
                }
            }

            var pIDs =[];
            for(p in cart){
                pIDs.push(cart[p]._id);
            }
            dal.getProductsByIDs(pIDs, function(err,products){
                 for( pi in products){
                     var p = products[pi];
                     var cat = cCat[p.category[0]]
                     if(cat._id ==0 && p.category[1])
                         cat = cCat[p.category[1]];

                    if(!os.categories[cat._id] ){
                        os.categories[cat._id] = {_id:cat._id,name:cat.name,products : []};
                    }
                    os.categories[cat._id].products.push(getProduct4Summery(p,c[p._id]));
                }
                 cb(err,os);
            });
        });
    }
    ,
    submitOrder: function(cart,cb){
        var c = cart, cbf = cb;
        
        this.getSummery(cart,function(err,os){
            var o = os;
            CalcPrices(o);
            o.dtl = c.dtl;
            o.dtl.createDate = new Date();
            o.dtl.status = "חדשה";
            dal.findOne('Customers',{email:o.dtl.email,hash:o.dtl.h},function(err,cust){
                o.customer = cust;
           
            dal.SaveDoc('Orders',o,function(err,d){
                 mailer.send({
                   from:    "sdd <admin@sds.co.il>", 
                   to:       o.customer.firstName + " <"+o.customer.email+">",
                   subject: "בשר מהכפר, הזמנה מספר " + d._id
                    },"Order",o,function(err,data){
                        var s = data;
                        });
                   mailer.send({
                   from:    "sd <admin@basarmeakfar.co.il>", 
                   to:      "dave <me@reydavid.com>,Muli <sd@sd.co.il>,Dudu <sd@sds.net>",
                   subject: "בשר מהכפר, הזמנה מספר " + d._id
                    },"Order",o,function(err,data){});
                cbf(err,d)}
                );
            });
        });
    }
};

function getProduct4Summery(prod,cartDtl){
    prod.cartDtl = cartDtl;
    setProdPrice(prod);
    return prod;
}

function setProdPrice(prod){
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
}

function CalcPrices(cart){
        cart.total = 0;
        for(c in cart.categories){
            if(c && cart.categories[c]){
                cart.categories[c].total = 0;
                for(p in cart.categories[c].products){
                    var prod = cart.categories[c].products[p];
                    if(p && prod){
                        setProdPrice(prod);
                        cart.categories[c].total += prod.cartDtl.total;
                    }
                }
               cart.categories[c].total =  Math.round( cart.categories[c].total * 100) /100
               cart.total += cart.categories[c].total;
            }
        }

        cart.total = Math.round( cart.total * 100) /100
    }

   

module.exports = o