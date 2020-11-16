var express = require('express');
var router = express.Router();

var wiki_controller = require("../controllers/wiki");

const withAuth = require('../utils/auth-token');

// creating the project route
router.post('/create', withAuth, wiki_controller.create_workspace);

// get the workspace based on workspace id
router.get('/:user_id/get/:workspace_id', withAuth, wiki_controller.get_singleWorkspace);

// updating the workspace - route
router.put('/:user_id/update/:workspace_id', withAuth, wiki_controller.update_workspace);

// getting the existing projects route
router.get('/list/:user_id', withAuth, wiki_controller.get_workspaces);

router.delete('/:user_id/delete/:workspace_id', withAuth, wiki_controller.delete_workspace);

module.exports = router;
