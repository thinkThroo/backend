var express = require('express');
var router = express.Router();

var project_controller = require("../controllers/project");

const withAuth = require('../utils/auth-token');

// creating the project route
router.post('/create', withAuth, project_controller.create_project);

// creating a task and update the parent project tasks array
router.post('/:user_id/create/:project_id', withAuth, project_controller.create_project);

// updating the project route
router.put('/:user_id/update/:project_id', withAuth, project_controller.update_project);

// getting the existing projects route
router.get('/list/:user_id', withAuth, project_controller.get_list);

router.delete('/:user_id/delete/:project_id', withAuth, project_controller.delete_project);

module.exports = router;
