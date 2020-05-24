const Task = require("../models/task");
const commonResponse = require('../utils/common-response');

let {
    successRes,
    failureRes
  } = commonResponse;

// create task route
exports.create_task = function(req, res) {
    // TODO: ADD MORE CONSTRAINTS ONCE ALL THE FEATURES ARE ADDED, including null check
    let data = req.body;
    console.log(data);
    data.created_at = new Date();
    const task = new Task(data);
    task.save(function (err, result) {
        if (err) {
            let responseMsg = "Error saving new task, please try again.";
            failureRes.msg = responseMsg;
            res.status(500).json(failureRes);
        } else {
            successRes.msg = "Successfully created task";
            res.status(200).json({...successRes, id: result._id});
        }
    });
};

//  get list of tasks created
exports.get_list = function(req, res) {
    Task.find({}).exec(function(err, result) {
        if (err) throw err;
        res.status(200).json({...successRes, events: result});
      });    
}