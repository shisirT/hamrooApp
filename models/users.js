var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	firstName: String,
	lastName: {
		type: String
	},
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: String,
	email: {
		type: String,
		unique: true,
		required: true
	},
	phoneNumber: Number,
	activeStatus: {
		type: Boolean,
		default: true
	},
	address: String,
	linkedIn_id: String,
	role: {
		type: Number, //1,superadmin,2 admin,3 end user
		default:3
	}
}, {
	timestamps: true
});

var UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;