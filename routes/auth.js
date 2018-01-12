var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var jwt = require('jsonwebtoken');

function createToken(data, config) {
	var token = jwt.sign({
		_id: data._id,
		firstName: data.firstName
	}, config.app.secret);

	//incase of expiry time 
	//{
	// 	expiresIn: '2h'
	// }

	return token;
}


var UserModel = require('./../models/users');

var passwordHash = require('password-hash');

function validate(req) {
	req.checkBody('username', 'User name is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password', 'Password should be 8 characters long').isLength({
		min: 8
	});
	req.checkBody('password', 'Password should not exceed more than 12 characters').isLength({
		max: 12
	});
	// req.checkBody('email', 'invalid email format').isEmail()

	var errors = req.validationErrors();

	if (errors) {
		return errors;
	} else {
		return null;

	}
}

function map_user_req(user, userDetails) {
	//TODO
	if (userDetails.firstName)
		user.firstName = userDetails.firstName;
	if (userDetails.lastName)
		user.lastName = userDetails.lastName;
	if (userDetails.phoneNumber)
		user.phoneNumber = userDetails.phoneNumber
	if (userDetails.email)
		user.email = userDetails.email
	if (userDetails.linkedIn_id)
		user.linkedIn_id = userDetails.linkedIn_id
	if (userDetails.address)
		user.address = userDetails.address
	if (userDetails.username)
		user.username = userDetails.username
	if (userDetails.password)
		user.password = passwordHash.generate(userDetails.password);
	if (userDetails.activeStatus)
		user.activeStatus = true
	if (userDetails.inActiveStatus)
		user.activeStatus = false

	return user;
}

module.exports = function(config) {

	router.get('/', function(req, res) {
		res.send('welcome to hamrooApp web application');
	})

	router.post('/login', function(req, res, next) {
		var error = validate(req);
		if (error) {
			next(error);
		}
		UserModel.findOne({
			// username: req.body.username,
			$or: [{
				username: req.body.username
			}, {
				email: req.body.username
			}]
		}, function(err, user) {
			if (err) {
				return next(err);
			}
			if (user) {
				var passMatch = passwordHash.verify(req.body.password, user.password);
				if (passMatch) {
					var token = createToken(user, config);

					res.status(200).json({
						user: user,
						token: token
					});
				} else {
					next({
						status: 403,
						message: 'User authentication failed'
					});
				}
			} else {
				res.json({
					message: 'user not found'
				});
			}
		});

	});

	router.post('/register', function(req, res, next) {

		var error = validate(req);

		if (error) {
			return next(error);
		}

		var newUser = new UserModel();
		var newMappedUser = map_user_req(newUser, req.body);
		newMappedUser.save(function(err, savedUser) {
			if (err) {
				return next(err);
			} else {
				console.log("user successfully saved to database");
				res.json(savedUser);
			}
		});
	});


	router.post('/forgotpassword', function(req, res, next) {

	});

	router.post('/resetpassword', function(req, res, next) {

	});


	return router;

}