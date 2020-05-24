var express = require('express');
var router = express.Router();

var task_controller = require("../controllers/task");

const withAuth = require('../utils/auth-token');

// creating the task route
router.post('/create', withAuth, task_controller.create_task);

// getting the existings tasks route
router.get('/list', withAuth, task_controller.get_list);

module.exports = router;
