var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');


var UserModel = require('./../models/users');


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
	if (userDetails.phone)
		user.phone = userDetails.phone
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
module.exports = function() {
	router.get('/', function(req, res, next) {
		UserModel.find({})
			.exec(function(err, result) {
				if (err) {
					return next(err);
				}
				res.status(200).json(result);
			});
	});

	router.get('/:id', function(req, res, next) {
		var id = req.params.id;
		UserModel.findById(id)
			.exec(function(err, result) {
				if (err) {
					return next(err);
				}
				if (result) {
					res.status(200).json(result);

				} else {
					res.status(200).json({
						message: 'user not found'
					});
				}
			});
	});
	router.put('/:id', function(req, res, next) {

		var err = validate(req)
		if (err) {
			return next(err);
		}
		var id = req.params.id;
		UserModel.findOne({
				_id: id
			})
			.exec(function(err, user) {
				if (err) {
					return next(err);
				}
				var updateUser = map_user_req(user, req.body);
				updateUser.save(function(err, done) {
					if (err) {
						return next(err);
					}
					res.status(200).json(done);
				});
			});

	});
	router.delete('/:id', function(req, res, next) {
		UserModel.findByIdAndRemove(req.params.id, function(err, removedUser) {
			if (err) {
				return next(err);
			}
			res.status(200).json(removedUser);
		})
	})

	return router;
}