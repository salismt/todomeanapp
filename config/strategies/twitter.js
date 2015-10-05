var passport = require('passport'),
	url = require('url'),
	TwitterStrategy = require('passport-twitter').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function () {
	passport.use(new TwitterStrategy({
		//populate with needed parameters
		consumerKey: config.twitter.clientID,
		consumerSecret: config.twitter.clientSecret,
		callbackURL: config.twitter.callbackURL,
		passReqToCallback: true
	},
	//create a new user object using the Facebook profile information
	function (req, token, tokenSecret, profile, done) {
		var providerData = profile._json;
		providerData.token = token;
		providerData.tokenSecret = tokenSecret;

		var providerUserProfile = {
			fullname: profile.displayName,
			username: profile.username,
			provider: 'twitter',
			providerId: profile.id,
			providerData: providerData
		};

		users.saveOAuthUserProfile(req, providerUserProfile, done);
	}
	));
};