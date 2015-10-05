var passport = require('passport'),
	url = require('url'),
	FacebookStrategy = require('passport-facebook').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function () {
	passport.use(new FacebookStrategy({
		//populate with needed parameters
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL,
		passReqToCallback: true
	},
	//create a new user object using the Facebook profile information
	function (req, accessToken, refreshToken, profile, done) {
		var providerData = profile.json;
		providerData.accessToken = accessToken;
		providerData.refreshToken =refreshToken;

		var providerUserProfile = {
			name: profile.name.giverName,
			email: profile.emails[0].value,
			username: profile.username,
			provider: 'facebook',
			providerId: profile.id,
			providerData: providerData
		};

		users.saveOAuthUserProfile(req, providerUserProfile, done);
	}
	));
};