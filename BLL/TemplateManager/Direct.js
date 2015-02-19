var resonder = require("../../DAL/Responder");
var ector = require("../Ector");
var cheerio = require('cheerio');

function Direct(request,response,pageParams){
        this.request = request;
        this.response = response;
        this.Templates = [];
        this.loadedCounter = 0;
        this.JQuery = null;
        this.params = pageParams;
        this.Js = "";
    }

Direct.prototype.Run = function(template){
    this.Templates.push({Container:template.Container, Template:template.Template,Index:this.Templates.length,Js:template.Js});
    if(template.Js)
         this.Js += template.Js +"; ";
    var i = this.Templates.length - 1;
     var responderName  = template.Data.Responder;
    if(responderName.indexOf("Responder") < 0)
        responderName += "Responder";
    var r = new resonder[responderName](this.request,this.response);
     r.GetData(template.Data,this.DataRecieved(i),this.params);
    };

Direct.prototype.DataRecieved = function(indx){
    var index = indx;
    var self = this;
     return function (err,data){
         self.Templates[index].Data = data;
         
         var renderer = ector.Renderer;
        var h = renderer.render(self.Templates[index].Template,data);
        ( function(html){
            self.Templates[index].html = html;
            if(index == 0){
                self.JQuery = cheerio.load(html);
                self.loadedCounter++;
            }
            
            if(self.JQuery != null)
            {
                var $ = self.JQuery;
                for(var i = index ; i< self.Templates.length ; i++){
                    if(i==0) 
                        continue;
                    if(self.Templates[i].html && $(self.Templates[i].Container).length > 0){
                        $(self.Templates[i].Container).html(self.Templates[i].html);
                        self.loadedCounter++;
                    }
                    else
                        break;
                }
            }
            
            if(self.loadedCounter==self.Templates.length ){
                var htm = self.JQuery.html();
                if( self.Js)
                    htm = htm.replace("</body>", "<script>" + self.Js + "</script></body>");
                sendResponse(self.response,"text/html",200,htm);
            }
            }(h.replace(/^\uFEFF/g, '')));

    }
}

    function sendResponse (response,contentType,status,body){
        var headers = {};
        headers["Content-Type"] = contentType;
        response.writeHead(status, headers);
        response.write(body);
        response.end();
}
module.exports =   Direct;