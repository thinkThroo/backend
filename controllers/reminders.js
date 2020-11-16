const Project = require("../models/project");
var cron = require('node-cron');
var dateHelpers = require("../utils/date");
var tzHelpers = require("../utils/node-cron-offset");

var job = null;

var remindersArray = [];

function handleReminders(remindersArray, ws, message, offsetForTz, job) {
    debugger
    // TODO: remove this added only for testing purpose
    // remindersArray = [{
    //     id: "id1",
    //     startTime: "2020-05-24T16:02:00.425Z",
    //     endTime: "2020-05-24T16:04:00.425Z"
    // }, {
    //     id: "id1",
    //     startTime: "2020-05-24T16:05:00.425Z",
    //     endTime: "2020-05-24T16:07:00.425Z"
    // }, {
    //     id: "id2",
    //     startTime: "2020-05-24T16:10:00.425Z",
    //     endTime: "2020-05-24T16:13:00.425Z"
    // }, {
    //     id: "id3",
    //     startTime: "2020-05-24T16:16:00.425Z",
    //     endTime: "2020-05-24T16:19:00.425Z"
    // }]
    if (message == "close") {
        console.log("about to stop cron job, since client connection lost");
        job.stop();
    } else {
        console.log("remindersArray inside handleReminders function", remindersArray);
        remindersArray.forEach(r => {
            debugger
            // let dtObj = dateHelpers.getDuration(r.startTime, r.endTime);
            let cronString = `${new Date(r.endTime).getSeconds()} ${new Date(r.endTime).getMinutes()} ${new Date(r.endTime).getHours()} ${new Date(r.endTime).getDate()} ${new Date(r.endTime).getMonth()+1} *`
            console.log("getTZLabel.getTZLabel(-330)", tzHelpers.getTZLabel(offsetForTz));
            let timezone = tzHelpers.getTZLabel(offsetForTz);
            debugger
            job = cron.schedule(cronString, () =>  {
                console.log('scheduled task on * 30 9 25 5 *--> need to make this dynamic');
                ws.send(`sending cron job data based`);
            }, {
                scheduled: false,
                timezone
            });
            
            job.start();
        })
    }
}

exports.set = function (ws) {
    ws.on('message', function incoming(message) {
        debugger;
        let data;
        if (message != "close") {
            data = JSON.parse(message);
        }
        if (typeof data != "string") {
            debugger;
            const {
                user_id,
                project_id
            } = data;
            Project.find({ user_id: user_id, isTask: false, _id: project_id }).exec(function (err, result) {
                debugger
                console.log("founnd list:", result);
                // get tasks from result
                if (result && result[0] && result[0]._doc) {
                    let tasks = result[0]._doc.tasks;
                    if (tasks != null) {
                        // if tasks exist for this found project id
                        // get tasks keys
                        let taskIdsArr = Object.keys(tasks);
                        // push the starttime, endtime, taskId into remindersArray
                        taskIdsArr.forEach(taskId => {
                            console.log(tasks[taskId].endTime);
                            remindersArray.push({
                                taskId,
                                startTime: tasks[taskId].startTime,
                                endTime: tasks[taskId].endTime
                            });
                        });
                    }
                    if (err) throw err;
                    handleReminders(remindersArray, ws, message, result[0]._doc.offsetForTz, job);
                }
            });
        } else {
            debugger;
            handleReminders(remindersArray, ws, message, job);
        }
    });
}