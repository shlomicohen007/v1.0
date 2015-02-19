var resonder = require("../../DAL/Responder");

function AjaxTm(request,response,pageParams){
        this.request = request;
        this.response = response;
        this.Templates = [];
        this.loadedCounter = 0;
        this.JQuery = null;
        this.params = pageParams;
        this.Js = "";
    }

AjaxTm.prototype.Run = function(template){
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

AjaxTm.prototype.DataRecieved = function(indx){
    var index = indx;
    var self = this;
     return function (err,data){
         self.Templates[index].Data = data;
         self.loadedCounter++;
            
            if(self.loadedCounter==self.Templates.length ){
               
                sendResponse(self.response,"application/json",200,JSON.stringify(self.Templates));
            }
         

    }
}

    function sendResponse (response,contentType,status,body){
        var headers = {};
        headers["Content-Type"] = contentType;
        response.writeHead(status, headers);
        response.write(body);
        response.end();
}
module.exports =   AjaxTm;