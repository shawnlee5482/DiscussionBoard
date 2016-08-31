var bcrypt = require('bcrypt-nodejs');
var hash1  = bcrypt.hashSync("bacon");
var res = bcrypt.compareSync("bacon", hash1);

if (res) {
	console.log("password is correct");
} else {
	console.log("password is not correct");
}


