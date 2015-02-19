var dal = require("../../DAL/dal").instance;

var operators = {};
dal.getOperators(function(err,OpArray){
    for(i=0; i< OpArray.length; i++)
        operators[OpArray[i].email] = OpArray[i].hash;
    });

var pub = {
        isOperator: function (request){
            var email = request.cookies['aEmail']
                ,hash = request.cookies['aH'];
            
            return (email && operators[email] == hash);
        }
    };

module.exports = pub