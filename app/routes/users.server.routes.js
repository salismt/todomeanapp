var users = require('../controllers/users.server.controller'),
	passport = require('passport');

module.exports = function(app) {
	app.route('/users')
		.post(users.create)
		.get(users.list);

	//the colon means this substring will be handled as a request parameter
	app.route('/users/:userId')
		.get(users.read)
		.put(users.update)
		.delete(users.delete);

	//app.param() method defines a middleware to be executed before any other middleware that uses users.userById()
	//to handle the population of the req.user object
	app.param('userId',  users.userByID);

	app.route('/register')
		.get(users.renderRegister)
		.post(users.register);

	app.route('/login')
		.get(users.renderLogin)
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		}));

	app.get('/logout', users.logout);

	app.route('/oauth/facebook')
		.get(passport.authenticate('facebook', {
			failureRedirect: '/login',
			scope: ['email']
		}));

	app.route('/oauth/facebook/callback')
		.get(passport.authenticate('facebook', {
			successRedirect: '/',
			failureRedirect: '/login',
			scope: ['email']
		}));

	app.route('/oauth/twitter')
		.get(passport.authenticate('twitter', {
			failureRedirect: '/login'
		}));

	app.route('/oauth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
};