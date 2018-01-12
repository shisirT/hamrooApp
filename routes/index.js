var express = require('express');
var router = express.Router();


module.exports = function() {

	router.get('/dashboard', function(req, res, next) {
		console.log('this is dashboard page');
		res.render('dashboard', {
			title: 'welcome',
			message: 'welcome to express js'
		});
	});


	return router;

}