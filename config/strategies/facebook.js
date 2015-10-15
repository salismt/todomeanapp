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
		passReqToCallback: true,
      	profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
	},
	//create a new user object using the Facebook profile information
	function (req, accessToken, refreshToken, profile, done) {

		var providerData = profile._json;
		providerData.accessToken = accessToken;
		providerData.refreshToken = refreshToken;

		var providerUserProfile = {
			name: profile.displayName,
			email   : profile.emails[0].value,
			provider: 'facebook',
			providerId: profile.id,
			providerData: providerData
		};
		console.log(providerUserProfile);
		users.saveOAuthUserProfile(req, providerUserProfile, done);
	}
	));
};