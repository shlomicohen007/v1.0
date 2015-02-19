(function (ng, $, undefined) {

    var renderQueue =[];
    
     $.ajax({ async: true
            , cache: true
            , dataType: "jsonp"
            , jsonpCallback : "cbJP"
            , url: '/min/Templates.js'
            , success: function(templates){
                var t = templates;
                ng.renderer = ECT({ root : t});
                for(var i=0; i<renderQueue.length; i++){
                    renderQueue[i]();
                }
                renderQueue = [];

            }
            , error: function (xhr, ajaxOptions, thrownError) {
                alert("err Templates.js:" +  thrownError);
                console.log(thrownError);
                console.log(xhr);
            }
            });

     ng.render = function(template,data,cb){
         if(ng.renderer){
            var h = ng.renderer.render(template,data);
            cb(h);
        }
         else{
             var t = template, d = data,cbf = cb;;
             renderQueue.push(function(){
                 var htm = ng.renderer.render(t,d);
                 cbf(htm);
             });
        }
    }

    // var spindelSocket = io.connect('http://' + window.location.host + '/spindel');
    // var  tmplatesQueue = [];


    //  spindelSocket.on('Partial', function (d) {
    //        if(requestNumber > d.Template.responseNum)
    //            return;
    //        d.Template.html = ng.renderer.render(d.Template.Template,d.Template.Data);
    //        console.log(d);

    //        if($(d.Template.Container).length > 0 ){
    //            $(d.Template.Container).html(d.Template.html);
    //            SetLinks(d.Template.Container);
    //            if(d.Template.Js)
    //                eval(d.Template.Js);

    //            for(var i = 0; i < tmplatesQueue.length; i++){
    //                if($(tmplatesQueue[i].Template.Container).length > 0 ){
    //                     $(tmplatesQueue[i].Template.Container).html(tmplatesQueue[i].Template.html);
    //                    tmplatesQueue.splice( i, 1 );
    //                }
    //            }

    //        }
    //        else{
    //            tmplatesQueue.push(d)
    //        }    
    //});


   
/*****************************************************************************************************************************/
      function SetLinks(containerSelector) {
            $(containerSelector + ' a').each(function (i, el) {
                var href = $(el).attr("href");
                if ($(el).attr('ajaxmode') == 'disabled'
                || !href || href == '#'
                || href.indexOf("http") > -1
                || href.indexOf("javascript:") > -1)
                    return;


                $(el).bind('click', function (e) {
                    var url = $(this).attr("href");
                    var container = $(this).attr('Container') ||  $(this).attr('container');
                    var disablescrolltop = $(this).attr('disablescrolltop');
                    var o = {Container:container,ScrollTop:(disablescrolltop != 'True')}

                   
                     if (url != '') {
                        ng.Load(url,o);
                        e.preventDefault();
                    }
                });

            });
        }
/*****************************************************************************************************************************/

        var requestNumber = 0;
        ng.ReloadContainer = function(container){
            ng.Load(window.location.pathname+window.location.search,{Container:container});
        };
        ng.Load = function(url,options){
            tmplatesQueue = [];
            var o = options || {};
            var cb = o.cb;
            delete o.cb;
            o.url = url
            o.requestNumber = requestNumber++;
            //spindelSocket.emit("get",o);
            $.ajax({
                async: true
           , type: "POST"
           , cache: false
           , dataType: "json"
           , data: { type: 'get', webReq: JSON.stringify(o) }
           , url: '/spindel'
           , success: function (d) {

               console.log(d);
               for (var i = 0; i < d.length; i++) {
                   var html = ng.renderer.render(d[i].Template, d[i].Data);
                   $(d[i].Container).html(html);
                   SetLinks(d[i].Container);
                   if (d[i].Js)
                       eval(d[i].Js);
               }
               $("#App").trigger("create");
               
               if (o.ScrollTop)
                   $(document).scrollTop(0);
               if (cb)
                   cb();
           }
           , error: function (xhr, ajaxOptions, thrownError) {
               console.log(thrownError);
               console.log(xhr);
           }
           });
            
             if (!o.DisablepushState) {
                 window.history.pushState(o, null, url);
                 initQS();
             }
            ng.current = o;
        };

        var wsCB = [];
        var wsReqCount = 0;

        ng.ws = function(funName,params,callback){
            var wsReq ={ 
                funcName:funName,
                params:params,
                reqNumber:wsReqCount++
            };

            //wsCB[wsReq.reqNumber] = callback;

            // spindelSocket.emit("ws",wsReq);
             $.ajax({ async: true
            ,type: "POST"
            , cache: false
            , dataType: "json"
            , data:{type:'ws', webReq: JSON.stringify(wsReq)}
            , url: '/spindel'
            , success: function(wsRes){
                callback(wsRes.data);
                }
            });
        };

        // spindelSocket.on('ws', function (wsRes) {
        //    wsCB[wsRes.reqNumber](wsRes.data);
        //    delete wsCB[wsRes.reqNumber];
        //});


         ng.bindForm = function (form,obj){
                         $('*[ng-form="'+form+'"] *[ng-key]').each(function(index,element){
                           var el = $(element);
                           var key = el.attr('ng-key');
                           if (!obj[key])
                               return;
                           if(el.is('input')){
                               switch(el.attr('type')){
                                   case 'text':
                                   el.val(obj[key]);
                                break;
                                case 'checkbox':
                                    el.prop('checked', obj[key]);
                               break;
                               case 'radio':
                                    var group = el.attr('name');
                                    $("input[name="+group+"][value=" + obj[key] + "]").attr('checked', 'checked');
                               break;
                              }
                          }
                          else
                          if(el.is('img')){
                              el.attr('src',obj[key]);
                          }
                          else
                          if(el.is('textarea')){
                              el.val(obj[key]);
                          }
                          else
                          if(el.is('select')){
                               el.val(obj[key]);
                          }
                           else
                          if(el.is('span')){
                               el.html(obj[key]);
                          }
                       });
                    };

        function parse(type,val){
            switch(type){
             case 'int':
                return parseInt(val);
             break;
            case 'intArray':
                for(var i = 0; i<val.length; i++)
                    val[i] = parseInt(val[i]);
                return val;
             break;
            case 'float':
                return parseFloat(val);
            break;
            default:
                return val;
            }
        }

        ng.validate = function(form){
            var isValid = true;
            $('*[ng-form="'+form+'"] *[ng-validate]').each(function(index,element){
                var el = $(element);
                var vt = el.attr('ng-validate');
                if(vt == "required"){
                    if(ignoreWatermark(el,el.val())!='')
                        el.removeClass('NotValid');
                    else{
                        el.addClass('NotValid');
                        isValid = false;
                    }
                }
            });
            return isValid;
        }

        ng.watermark = function(form){
            function wm(el,watermark){
                 if(el.val()==''){
                       el.val(watermark);
                       el.addClass('watermark');
                   }
                }
              $('*[ng-form="'+form+'"] *[ng-watermark]').each(function(index,element){
                   var el = $(element);
                   var watermark = el.attr('ng-watermark');
                   el.focus(function(){
                       el.removeClass('watermark');
                       if(el.val()==watermark)
                           el.val('');
                    });
                   el.blur(function(){
                       wm(el,watermark);
                    });

                    wm(el,watermark);
            });
        }

        function ignoreWatermark(el,val){
            var wm = el.attr('ng-watermark');
            if(wm && wm == val)
                return '';
            else
                return val;
        }

        ng.getFormData = function (form) {
            var obj = {};

            $('*[ng-form="' + form + '"] *[ng-key]').each(function (index, element) {
                var el = $(element);
                var key = el.attr('ng-key');
                if (el.is('input')) {
                    switch (el.attr('type')) {
                        case 'text':
                            obj[key] = parse(el.attr('ng-parse'), ignoreWatermark(el, el.val()));
                            break;
                        case 'password':
                            obj[key] = parse(el.attr('ng-parse'), ignoreWatermark(el, el.val()));
                            break;
                        case 'hidden':
                            obj[key] = parse(el.attr('ng-parse'), ignoreWatermark(el, el.val()));
                            break;
                        case 'checkbox':
                            obj[key] = el.prop('checked');
                            break;
                        case 'radio':
                            var group = el.attr('name');
                            obj[key] = $("input[name=" + group + "]:checked").val();
                            break;
                    }
                }
                else
                    if (el.is('img')) {
                        obj[key] = el.attr('src');
                    }
                    else
                        if (el.is('textarea')) {
                            obj[key] = ignoreWatermark(el, el.val());
                        }
                        else
                            if (el.is('select')) {
                                obj[key] = parse(el.attr('ng-parse'), el.val());
                                if (el.attr('ng-add-key')) {
                                    var addKey = el.attr('ng-add-key');
                                    el.find("option:selected").each(function () {
                                        obj[addKey] = $(this).attr('ng-' + addKey + '-val');
                                    });
                                }

                            }
                            else
                                if (el.is('span') || el.is('b')) {
                                    obj[key] = parse(el.attr('ng-parse'), el.html());
                                }
            });

            return obj;
        };

        function initQS() {
            var qs = {};
            var u = window.location.search.toString().replace('?','');
            var qsp = u.split("&");
            for (var i = 0; i < qsp.length; i++) {
                var qspp = qsp[i].split("=");
                if (qspp.length > 0)
                    qs[qspp[0]] = qspp[1];
            }
            ng.QS = qs;
        };


        initQS();

        $(document).ready(function () {
           
            setTimeout(function(){
                if(window.addEventListener)
                {
                     window.addEventListener("popstate", function (e) {
                        
                            var cur = ng.current.url;
                            if (cur.indexOf("/") != 0)
                                cur = "/" + cur;
                           // console.log(location.pathname + location.search + ' != ' + cur + (location.pathname + location.search != cur));
                            if (location.pathname + location.search != cur) {
                                //ng.Load(location.pathname + location.search,{DisablepushState:true,Container:'#Pane',ScrollTop:true});
                                window.location = location.pathname + location.search;
                            }
                       
                     }, false);
                 }
                 else
                 {
                    window.attachEvent("onpopstate ",function (e) {
                        
                            var cur = ng.current.url;
                            if (cur.indexOf("/") != 0)
                                cur = "/" + cur;
                           // console.log(location.pathname + location.search + ' != ' + cur + (location.pathname + location.search != cur));
                            if (location.pathname + location.search != cur) {
                                //ng.Load(location.pathname + location.search,{DisablepushState:true,Container:'#Pane',ScrollTop:true});
                                window.location = location.pathname + location.search;

                            }
                       
                     });
                 }
                 
                 console.log('ready... setLinks');
                 SetLinks('body');
            }, 500);

            
        });
}(window.ng = window.ng || {}, jQuery));


