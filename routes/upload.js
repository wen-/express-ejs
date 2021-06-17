var express = require('express');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + Date.now() + '.' + (file.mimetype.split('/'))[1])
  }
})
var upload = multer({storage: storage});
var router = express.Router();

/* GET users listing. */
router.post('/', upload.array('files'), function(req, res, next) {
  console.log(req.body);
});

module.exports = router;
