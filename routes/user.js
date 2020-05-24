var express = require('express');
var router = express.Router();

var user_controller = require("../controllers/user");

router.post('/register', user_controller.user_create_post);

router.post('/login', user_controller.user_login);

module.exports = router;
