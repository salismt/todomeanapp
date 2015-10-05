var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	email: {
		type: String,
		index: true
	},
	username: {
		type: String,
		trim: true,
		unique: true
	},
	password: String,
	//the strategy used to register the user
	provider: String,
	//the user identifier for the authentication strategy
	providerId: String,
	//use it later to store the user object retrieved from OAuth providers
	providerData: {},
	// we will use this in the next tutorial to store TODOs
	todos: {} 
});

//Hashing the password before saving it to the MongoDB
UserSchema.pre('save',
	function (next) {
		if (this.password) {
			// using 'crypto' module
			//create and return a hash object as md5 variable
			var md5 = crypto.createHash('md5');
			//update the password and digest() calculates the digest of passed data to be hased in 'hex' encoding
			this.password = md5.update(this.password).digest('hex');
		}
		next();
	}
);

//authenticate() method accepts a string password argument, then hashes and compares to the current users hashed password
UserSchema.methods.authenticate = function (password) {
	var md5 = crypto.createHash('md5');
	md5 = md5.update(password).digest('hex');

	return this.password === md5;
};

//findUniqueUsername static method is used to find an available unique username for new users (used later with OAuth authentication)
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne(
		{username: possibleUsername},
		function (err, user) {
			if (!err) {
				if (!user) {
					callback(possibleUsername);
				}
				else {
					return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
				}
			}
			else {
				callback(null);
			}
		}
	);
};

mongoose.model('User', UserSchema);