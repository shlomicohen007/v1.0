function OpenOrder(orderID,parems){
    ng.ws("getOrder",orderID,function(order){
        var o = order;
        o.Params = parems;
             var html = ng.renderer.render('Store/Order',o);
           $('#OS').html(html);
           openLightBox('#OrderView');
        });
}