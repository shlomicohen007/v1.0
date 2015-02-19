
function OpenProductForm(productID){
    if(productID){
       ng.ws('getProduct',productID,function(p){
          BindProductForm(p);
       });
   }

   openLightBox('#ProductEditor');
}


function BindProductForm(prod){
   ng.bindForm('Product',prod);
   
}


function SaveProductForm(){
    var prod = ng.getFormData('Product');

   console.log(prod);
   ng.ws('saveProduct',prod,function(data){
       ng.ReloadContainer('#Grid');
       closeLightBox();
   });
}

window.setProdImg = function (img) {
    $('#prodImg').attr('src', 'ProdPic/' + img);
}

function searchProduct(){
    ng.Load('/admin/products?name=' + $('#name').val(), { DisablepushState: true,Container:'#Grid' });
}