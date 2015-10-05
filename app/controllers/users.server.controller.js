//this controller provides interaction with mongoose models and use mongoose API
var User 		= require('mongoose').model('User'),
	passport 	= require('passport');

//get error message
var getErrorMessage = function (err) {
	var message = '';
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = "Username already exists";
				break;
			default:
				message = "Something went wrong";
		}
	}
	else {
		for (var errName in err.errors) {
			if (err.errors[errName].message)
				message = err.errors[errName].message;
		}
	}

	return message;
};

//renderLogin page
exports.renderLogin = function(req, res, next) {
	if (!req.user) {
		//render by using login.ejs
		res.render('login', {
			title: 'Log-in Form',
			messages: req.flash('error') || req.flash('info')
		});
	}
	else {
		return res.redirect('/');
	}
};

//renderRegister page
exports.renderRegister = function(req, res, next) {
	if (!req.user) {
		//render by using register.ejs
		res.render('register', {
			title: 'Register form',
			messages: req.flash('error')
		});
	}
	else {
		return res.redirect('/');
	}
};

//register() method uses your User model to create new users
exports.register = function(req, res, next) {
	if (!req.user) {
		//use your User model, then creates a user object from HTTP req.body
		var user = new User(req.body);
		var message = null;
		//set the provider property to local
		user.provider = 'local';
		//save it to MongoDB
		user.save(function(err) {
			//if error, the register() method will use getErrorMessage() to fetch the errors
			if (err) {
				var message = getErrorMessage(err);
				req.flash('error', message);
				return res.redirect('/register');
			}
			//after the user was created successfully, the user session will be created using req.login()
			//req.login() provided by passport module
			req.login(user, function(err) {
				if (err) {
					return next(err);
				}
				//after login completed, a user object will be inside the req.user object
				else {
					return res.redirect('/');
				}
			});
		});
	}
	else {
		return res.redirect('/');
	}
};

//logout
exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

//Enable OAuthUser 
exports.saveOAuthUserProfile = function (req, profile, done) {
	//Accept a user profile & looks for an existing user
	User.findOne(
		{
			// look existing user with providerId and provider
			provider: profile.provider,
			providerId: profile.providerId
		},
		function (err, user) {
			if (err) {
				return done(err);
			}
			else {
				//If existing user isn't found
				if (!user) {
					var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
					//find unique username using model's findUniqueUsername() method
					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						profile.username = availableUsername;
						user = new User(profile);

						user.save(function (err) {
							if (err) {
								//if error occur, will use req.flash() & getErrorMessage to report the error
								var message = getErrorMessage(err);
								req.flash('error', messages);
								return res.redirect('/signup');
							}
							else {
								//done callback method
								return done(err, user);
							}

						});
					});
				}
				//User is found, call done() callback method with the user's MongoDB document
				return done(err, user);
			}
		}
	);
};

exports.create = function(req, res, next) {
    var user = new User(req.body);
    user.save(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(user);
        }
    });
};

exports.list = function(req, res, next) {
    User.find({}, function(err, users) {
        if (err) {
            return next(err);
        }
        else {
            res.json(users);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.user);
};

exports.userByID = function(req, res, next, id) {
    User.findOne({
            _id: id
        },
        function(err, user) {
            if (err) {
                return next(err);
            }
            else {
                req.user = user;
                next();
            }
        }
    );
};

exports.update = function(req, res, next) {
    User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
        if (err) {
            return next(err);
        }
        else {
            return res.json(user);
        }
    });
};

exports.delete = function(req, res, next) {
    req.user.remove(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(req.user);
        }
    });
};

exports.requiresLogin = function (req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			messages: 'User is not logged in'
		});
	}
	else {
		return next();
	}
};