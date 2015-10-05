var passport 		= require('passport'),
	// local strategy module's Strategy object
	LocalStrategy 	= require('passport-local').Strategy,
	User 			= require('mongoose').model('User');

module.exports = function () {
	//register the strategy using passport.use() method that uses instance of LocalStrategy object
	passport.use(new LocalStrategy(function (username, password, done) {
		//inside callback function you use the User model to find a user with the passed username & try to authenticate it
		User.findOne(
			{username: username},
			function (err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {message: 'Uknown user'});
				}
				if (!user.authenticate(password)) {
					return done(null, false, {message: 'Invalid Password'});
				}
				return done(null, user);
			}

		);
	}));
};