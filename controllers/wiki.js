const Wiki = require("../models/wiki");
const commonResponse = require('../utils/common-response');
const mongoose = require("mongoose");

let {
    successRes,
    failureRes
} = commonResponse;

// create work_space API
exports.create_workspace = function (req, res) {
    let data = req.body;
    data.created_at = new Date();
    const wiki = new Wiki(data);
    wiki.save(function (err, saveRes) {
        if (err) {
            console.log("error saving new project", err);
            let responseMsg = "Error saving new project, please try again.";
            // console.log("err.errors['user_id'] instanceof mongoose.Error.ValidatorError;", err.errors['user_id'] instanceof mongoose.Error.ValidatorError);
            // console.log("err.errors['some_prop'] instanceof mongoose.Error.ValidatorError;", err.errors['some_prop'] instanceof mongoose.Error.ValidatorError);
            if (err.errors['user_id'] instanceof mongoose.Error.ValidatorError)
                responseMsg = "Error saving new project, user_id is missing.";
            failureRes.msg = responseMsg;
            res.status(500).json(failureRes);
        } else {
            successRes.msg = "Successfully created wiki workspace";
            res.status(200).json({ ...successRes, _id: saveRes._id });
        }
    });
}

// update wiki workspace
exports.update_workspace = function (req, res) {
    // TODO: ADD MORE CONSTRAINTS ONCE ALL THE FEATURES ARE ADDED, including null check
    let {
        user_id,
        workspace_id
    } = req.params;
    let data = req.body;
    data.updated_at = new Date();
    // console.log("data in updateporject function", data, "check what is value of isTask property");
    Wiki.updateOne({ _id: workspace_id, user_id: user_id }, { $set: data }, function (err, result) {
        if (err) {
            console.log("err", err);
            let responseMsg = "Error updating project, please try again.";
            // console.log("err.errors['user_id'] instanceof mongoose.Error.ValidatorError;", err.errors['user_id'] instanceof mongoose.Error.ValidatorError);
            // console.log("err.errors['some_prop'] instanceof mongoose.Error.ValidatorError;", err.errors['some_prop'] instanceof mongoose.Error.ValidatorError);
            if (err && err.errors && err.errors['user_id'] instanceof mongoose.Error.ValidatorError)
                responseMsg = "Error updating project, user_id is missing.";
            failureRes.msg = responseMsg;
            res.status(500).json(failureRes);
        } else {
            successRes.msg = "Successfully updated workspace";
            // console.log("update project re sult::", result);
            res.status(200).json({ ...successRes, _id: result._id });
        }
    });
};

//  get list of tasks created
exports.get_workspaces = function (req, res) {
    let user_id = req.params.user_id;
    // console.log("inside get_list api")
    Wiki.find({ user_id: user_id }).exec(function (err, result) {
        // console.log("founnd list:", result);
        if (err) throw err;
        successRes.msg = "Successfully found workspaces";
        res.status(200).json({ ...successRes, list: result });
    });
}

// get single workspace based on workspace id
exports.get_singleWorkspace = function (req, res) {
    let {
        user_id,
        workspace_id
    } = req.params;
    Wiki.find({ user_id: user_id, _id: workspace_id }).exec(function (err, result) {
        // console.log("founnd list:", result);
        if (err) throw err;
        successRes.msg = "Successfully found workspaces";
        res.status(200).json({ ...successRes, list: result });
    });
}

exports.delete_workspace = function (req, res) {
    let {
        user_id,
        workspace_id
    } = req.params
    console.log("user_id, project_id in delete api", user_id, workspace_id);
    Wiki.remove({
        _id: workspace_id,
        user_id: user_id
    }, function (err, result) {
        console.log("result:", result);
        if (err) throw err;
        successRes.msg = "Successfully deleted workspace";
        res.status(200).json({ ...successRes });
    });
}