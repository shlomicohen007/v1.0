var dal = require("./DAL/dal").instance;

console.log(dal);

console.log('Starting...');
dal.updateCityArea(function(){
	console.log('finished update...');
});
