var resonder = require("../../DAL/Responder");

function BySocket(params,soket,pageParams){
        this.params = params;
        this.soket = soket;
        this.Templates = [];
        this.loadedCounter = 0;
        this.PageParams = pageParams;
      
    }

BySocket.prototype.Run = function(template){
    this.Templates.push({Container:template.Container, Template:template.Template,Index:this.Templates.length,Js:template.Js});
    var i = this.Templates.length - 1;
    var responderName  = template.Data.Responder;
    if(responderName.indexOf("Responder") < 0)
        responderName += "Responder";
    var r = new resonder[responderName](this.params,this.soket);
     r.GetData(template.Data,this.DataRecieved(i),this.PageParams);
};

BySocket.prototype.DataRecieved = function(i){
    var index = i;
    var self = this;
     return function (err,data){
         self.Templates[index].Data = data;
         self.loadedCounter++;
         var res = {responseNum: self.params.requestNumber,internal: i};
          res.Template = self.Templates[i];
          self.soket.emit('Partial',res);
       };
}
module.exports =   BySocket;