var express = require('express');
var router = express.Router();
var ProductModel = require('./../models/products');
var multer = require('multer');
// var upload = multer({
//   dest: 'uploads/'
// });
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/my-uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
});

function fileFilter(req, file, cb) {
  if (file.mimetype == 'image/jpeg' | file.mimetype == 'image/png' | file.mimetype == 'image/gif') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

var upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

function mapProductRequest(product, productDetails) {
  if (productDetails.category)
    product.category = productDetails.category
  if (productDetails.name)
    product.name = productDetails.name
  if (productDetails.description)
    product.description = productDetails.description
  if (productDetails.brand)
    product.brand = productDetails.brand
  if (productDetails.measurementUnit)
    product.measurementUnit = productDetails.measurementUnit
  if (productDetails.price)
    product.price = productDetails.price
  if (productDetails.color)
    product.color = productDetails.color
  if (productDetails.status)
    product.status = productDetails.status
  if (productDetails.manuDate)
    product.manuDate = productDetails.manuDate
  if (productDetails.attributes)
    product.attributes = productDetails.attributes
  if (productDetails.rating)
    product.rating = productDetails.rating
  if (productDetails.imageName)
    product.imageName = productDetails.imageName
  if (productDetails.feedbacks)
    product.feedbacks = productDetails.feedbacks
  if (productDetails.address)
    product.address = productDetails.address
  if (productDetails.tags)
    product.tags = productDetails.tags

  return product;
}

module.exports = function () {
  /*
  get all products
  */
  router.get('/', function (req, res, next) {
    console.log('this is get requrst to fetch all porducts ');
    console.log('now in request object we have a property called user that holds information of current user >>>>>>', req.user);
    ProductModel.find({})
      .sort({
        _id: -1
      })
      .populate('user', {
        firstName: 1,
        email: 1
      })
      .exec(function (err, products) {
        if (err) {
          return next(err);
        }
        res.status(200).json(products);

        // if (products.length) {
        //   res.status(200).json(products);
        // } else {
        //   res.json({
        //     result: 'no any products found'
        //   });
        // }
      });
  });
  /*
  	get product by id
  */
  router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    ProductModel.findOne({
        _id: id
      })
      .exec(function (err, result) {
        if (err) {
          return next(err);
        }
        if (result) {
          res.status(200).json(result);
        } else {
          res.json({
            result: 'no product find by given id'
          });
        }
      });
  });
  /*
  insert new product
  */
  router.post('/', upload.single('testFile'), function (req, res, next) {
    //req.body///value
    console.log('req.file is now', req.file);
    req.body.imageName = req.file.filename;
    var newProduct = new ProductModel();
    var mappedProduct = mapProductRequest(newProduct, req.body);
    mappedProduct.user = req.user._id;
    mappedProduct.save((err, savedUser) => {
      if (err) {
        return next(err);
      }
      res.status(200).json(savedUser);
    })
  });
  /*
  	update product by id
  */
  router.put('/:id', function (req, res, next) {
    var id = req.params.id;
    ProductModel.findById(id)
      .exec(function (err, result) {
        if (err) {
          return next(err);
        }
        if (result) {
          var updateProduct = mapProductRequest(result, req.body);
          updateProduct.save(function (err, done) {
            if (err) {
              next(err);
            } else {
              res.status(200).json(done);
            }
          });
        } else {
          res.json({
            result: 'no product find by given id'
          });
        }
      });
  });
  /*
  delete product by id
  */
  router.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    // ProductModel.findById(id)
    //   .exec(function (err, result) {
    //     if (err) {
    //       return next(err);
    //     }
    //     if (result) {
    //       result.remove(function (err, done) {
    //         if (err) {
    //           return next(err);
    //         }
    //         res.status(200).json(done);
    //       })
    //     } else {
    //       res.json({
    //         result: 'no product find by given id'
    //       });
    //     }
    //   });
    ProductModel.findByIdAndRemove(id, function (err, done) {
      if (err) {
        return next(err);
      }
      res.status(200).json(done);
    })
  });
  /*
  search product
  */
  router.post('/search', function (req, res, next) {
    //name,price,clour category
    var condition = {};
    var searchQuery = mapProductRequest(condition, req.body);
    ProductModel.find(searchQuery).exec(function (err, done) {
      if (err) {
        return next(err);
      }
      res.status(200).json(done);
    })

  });

  return router;
}
