var passport = require('passport'),
	mongoose = require('mongoose');

module.exports = function () {
	var User = mongoose.model('User');

	//define how passport will handle user serializeation
	passport.serializeUser(function (user, done) {
		//when authenticated, passport will save its _id
		done(null, user.id);
	});

	// when the user object will be needed Passport will use the _id property
	passport.deserializeUser(function (id, done) {
		//fetch the user object from the database
		User.findOne(
			{_id: id},
			//-password option is set so that mongoose doesn't fetch the password field
			'-password',
			function (err, user) {
				done(err,  user);
			}
		);
	});
	//include local strategy, once you load Passport configuration file in server.js
	// loads its strategies configuration file
	require('./strategies/local.js')();
	require('./strategies/facebook.js')();
	require('./strategies/twitter.js')();
};