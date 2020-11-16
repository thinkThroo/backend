var express = require('express');
var router = express.Router();

var project_controller = require("../controllers/project");

const withAuth = require('../utils/auth-token');

// creating the project route
router.post('/:user_id/:workspace_id/create', withAuth, project_controller.create_project);

// creating a task and update the parent project tasks array
router.post('/:user_id/create/:project_id', withAuth, project_controller.create_project);

// updating the project route
router.put('/:user_id/:workspace_id/update/:project_id', withAuth, project_controller.update_project);

// getting the existing projects route
router.get('/:user_id/:workspace_id/list', withAuth, project_controller.get_list);

// http://localhost:3200/api/project/5ecb5086e42ce113c6c22431/get/5ee1fbdff0dfb4119826b329/project/5ee3444a84f81d2171a52f23
router.get('/:user_id/get/:workspace_id/project/:project_id', withAuth, project_controller.get_project);

router.delete('/:user_id/:workspace_id/delete/:project_id', withAuth, project_controller.delete_project);

module.exports = router;
