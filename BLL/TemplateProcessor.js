var pt = require("../Settings/PageTemplate").pageTemplate;

var proc =  (function(){
    var pub = {
        GetTemplate:function(templateKey){
            return pt[templateKey];
        },
        GetHtmlTemplates: getHtmlTemplates,
        Process:process
    }

        function process(templateKey,container,templateManager){
             // find the correct Template
             var t = templateFinder(pt[templateKey],container);
             if(t==null)
                 t = pt[templateKey].Templates[0];
             var tt = JSON.parse( JSON.stringify(t) );
            
             // process template tree
             templateIterator(tt,templateManager);
       }


        // recurcively itarate the Template tree and find the one with the container
        function templateFinder(template,container){
            var tArray = template.Templates || [];
            for(var i = 0; i< tArray.length; i++){
                if(tArray[i].Container == container)
                    return tArray[i];
                else {
                var t = templateFinder(tArray[i],container);
                if(t)
                    return t;
                }
            }
        }

        // recurcively itarate the Template tree and run templateManager.Run on eache template
        function templateIterator(template,templateManager){
            templateManager.Run(template);
            var tArray = template.Templates || [];
            for(var i = 0; i< tArray.length; i++){
                templateIterator(tArray[i],templateManager);
            }
        }

        function getHtmlTemplates(){
            var templatesArray={};
           var tm  = { Run: function(template){ templatesArray[template.Template] =1; } };

            for( var page in pt){
                    templateIterator(pt[page].Templates[0],tm);
                }
            return templatesArray;
        }

    return pub
    }());


exports.Processor = proc;

