var express = require('express');
var router = express.Router();
var service = require("../controllers/index");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/upload', service.upload_file);

module.exports = router;
