const Project = require("../models/project");
const commonResponse = require('../utils/common-response');
const mongoose = require("mongoose");
const projectHelpers = require("../utils/project");

let {
    successRes,
    failureRes
} = commonResponse;

// create task route
exports.create_project = function (req, res) {
    // TODO: ADD MORE CONSTRAINTS ONCE ALL THE FEATURES ARE ADDED, including null check
    let data = req.body;
    let {
        user_id,
        project_id
    } = req.params
    console.log("about to create project with this data:", data, "if this is a task, check that is Topic is set true");
    data.created_at = new Date();
    const project = new Project(data);
    project.save(function (err, saveRes) {
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
            console.log("project created and saved success");
            // TODO : KEEP THIS DRY, LOOKS UNREADBLE!!
            if (project_id) {
                console.log("since project_id exists-> find parent project");
                Project.find({ _id: project_id, user_id: user_id }, function (err, findRes) {
                    debugger;
                    if (err) {
                        console.log("err", err);
                        let responseMsg = "Error in find the parent project, please try again.";
                        // console.log("err.errors['user_id'] instanceof mongoose.Error.ValidatorError;", err.errors['user_id'] instanceof mongoose.Error.ValidatorError);
                        // console.log("err.errors['some_prop'] instanceof mongoose.Error.ValidatorError;", err.errors['some_prop'] instanceof mongoose.Error.ValidatorError);
                        if (err && err.errors && err.errors['user_id'] instanceof mongoose.Error.ValidatorError)
                            responseMsg = "Error updating project, user_id is missing.";
                        failureRes.msg = responseMsg;
                        res.status(500).json(failureRes);
                    }
                    console.log("found document to fetch tasks array", findRes);
                    let tasks = findRes[0].tasks;
                    // tasks.push(saveRes._id);
                    tasks[saveRes._id] = project;
                    console.log("update the parent project's tasks object with the one just created as it is a task");
                    Project.updateOne({ _id: project_id, user_id: user_id }, { $set: {tasks}}, function (err, result) {
                        debugger;
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
                            successRes.msg = "Successfully created task and updated parent project with updated tasks array";
                            res.status(200).json({ ...successRes, _id: saveRes._id, tasks });
                        }
                    });
                });
            } else {
                debugger;
                successRes.msg = "Successfully created task";
                res.status(200).json({ ...successRes, _id: saveRes._id });
            }
        }
    });
};

// update task route
exports.update_project = function (req, res) {
    // TODO: ADD MORE CONSTRAINTS ONCE ALL THE FEATURES ARE ADDED, including null check
    let {
        user_id,
        project_id
    } = req.params;
    let data = req.body;
    data.updated_at = new Date();
    let updatedData = projectHelpers.getUpdateData(data);
    // console.log("data in updateporject function", data, "check what is value of isTask property");
    Project.updateOne({ _id: project_id, user_id: user_id }, { $set: updatedData }, function (err, result) {
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
            successRes.msg = "Successfully updated task";
            // console.log("update project re sult::", result);
            res.status(200).json({ ...successRes, _id: result._id });
        }
    });
};

//  get list of tasks created
exports.get_list = function (req, res) {
    let user_id = req.params.user_id;
    // console.log("inside get_list api")
    Project.find({ user_id: user_id, isTask: false }).exec(function (err, result) {
        // console.log("founnd list:", result);
        if (err) throw err;
        res.status(200).json({ ...successRes, list: result });
    });
}

exports.delete_project = function (req, res) {
    let {
        user_id,
        project_id
    } = req.params
    console.log("user_id, project_id in delete api", user_id, project_id);
    Project.remove({
        _id: project_id,
        user_id: user_id
    }, function (err, result) {
        console.log("result:", result);
        if (err) throw err;
        successRes.msg = "Successfully deleted task";
        res.status(200).json({ ...successRes });
    });
}