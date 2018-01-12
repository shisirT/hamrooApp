var mongoose = require('mongoose');
module.exports = function (config) {
  mongoose.connect(config.mongodb.mlabUrl);

  mongoose.connection.on('error', function (err) {
    console.log('error occured while connecting to db');
  });
  mongoose.connection.once('open', function (done) {
    console.log('successfully connected to database');
  });
}
