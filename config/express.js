//base setup
var express 	= require('express'),
	config		= require('./config'),
	bodyParser 	= require('body-parser'),
	passport 	= require('passport'),
	flash 		= require('connect-flash'),
	session		= require('express-session');

module.exports = function() {
	//initialize express application object
	var app = express();

	//middlewares that parses only urlencoded bodies
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	//parses only json
	app.use(bodyParser.json());

	//flash middlewares
	app.use(flash());

	//session middlewares
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: 'OurSuperCookieSecret'
	}));

	// set views location and view templating engine
	app.set('views', './app/views');
	app.set('view engine', 'ejs');

	//passport middlewares
	app.use(passport.initialize());
	app.use(passport.session());

	//assigning app to routes
	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);
	require('../app/routes/todos.server.routes.js')(app);
	
	//include static files
	app.use(express.static('./public'));
	// return the app to server.js
	return app;
};