var fs = require("fs");
var packer = require("../../settings/Packer.js");

function Run(){
    for(i=0; i<packer.length; i++){
        var fCode = "";
        for(var f=0; f< packer[i].files.length; f++){
            var f2Compress = fs.readFileSync( packer[i].files[f],'utf8');
              if (f2Compress.indexOf('\uFEFF') === 0) {
                f2Compress = f2Compress.substring(1, f2Compress.length);
            }
            fCode += f2Compress;
        }

        fs.writeFile(packer[i].PackTo,fCode,'utf8');
    }
}



module.exports.Run = Run;