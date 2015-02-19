function AutoForm (){
    
}


AutoForm.prototype.Open = function(obj){
   var div =  $('AF'+obj.ID);
   if(!div){
       $('body').prepend('<div id="AF'+obj.ID +'" class="AutoForm"></div>');
    }

   var htm = ng.renderer('Core/AutoForm',obj.Meta);

    $('AF'+obj.ID).html(htm).show(500);

}