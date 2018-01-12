var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
  country: String,
  city: String,
  zone: String,
  zipCode: String,
  streetAddress: String,
  houseNo: String
});
var distributorSchema = new Schema({
  name: String,
  address: locationSchema,
  email: {
    type: String
  },
  contactNumber: {
    type: Number
  }
});


var productSchema = new Schema({
  category: {
    type: String
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  brand: {
    type: String
  },
  measurementUnit: {
    type: String
  },
  price: {
    type: Number
  },
  color: {
    type: String,
  },
  status: {
    type: String,
    default: 'available'
  },
  manuDate: {
    type: Date,
    default: Date.now()
  },
  attributes: {
    type: String
  },
  rating: {
    type: Number,
    default: 3
  },
  imageName: String,
  feedbacks: {
    type: String
  },
  address: String,
  tags: [String],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('product', productSchema);
