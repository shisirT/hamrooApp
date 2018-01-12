var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var expressValidators = require('express-validator');
var path = require('path');

var config = require('./config');
require('./db')(config);
var authRoute = require('./routes/auth')(config);
var indexRoute = require('./routes/index')();
var userRoute = require('./routes/user')();
var productRoute = require('./routes/products')();


var authorize = require('./middlewares/authorize');
var authenticate = require('./middlewares/authenticate');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(expressValidators());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/', authRoute);

app.use('/home',authenticate, indexRoute);
app.use('/user', authenticate, userRoute);
app.use('/product',authenticate, productRoute);


app.use(function(req, res, next) {
	next({
		status: 404,
		message: 'not found'
	});
});
///error handler in expresss
app.use(function(err, req, res, next) {
	console.log('err handling middleware called');
	res.json({
		staus_code: err.status || 500,
		msg: err.message || err
	});
});


app.listen(config.app.port, function(err, done) {
	if (err) {
		console.log('error occur while listening', err);
	} else {
		console.log('server created at port ' + config.app.port);
	}
});