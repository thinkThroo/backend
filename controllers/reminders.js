const Project = require("../models/project");
var cron = require('node-cron');
var dateHelpers = require("../utils/date");
var tzHelpers = require("../utils/node-cron-offset");

var job = null;

var remindersArray = [];

function handleReminders(remindersArray, ws, message) {
    debugger
    // TODO: remove this added only for testing purpose
    remindersArray = [{
        id: "id1",
        startTime: "2020-05-24T16:02:00.425Z",
        endTime: "2020-05-24T16:04:00.425Z"
    }, {
        id: "id1",
        startTime: "2020-05-24T16:05:00.425Z",
        endTime: "2020-05-24T16:07:00.425Z"
    }, {
        id: "id2",
        startTime: "2020-05-24T16:10:00.425Z",
        endTime: "2020-05-24T16:13:00.425Z"
    }, {
        id: "id3",
        startTime: "2020-05-24T16:16:00.425Z",
        endTime: "2020-05-24T16:19:00.425Z"
    }]
    if (message == "close") {
        console.log("about to stop cron job, since client connection lost");
        job.stop();
    } else {
    // console.log("remindersArray inside handleReminders function", remindersArray);
        // remindersArray.forEach(r => {
        //     let dtObj = dateHelpers.getDuration(r.startTime, r.endTime);
        //     let cronString = `${dtObj.seconds} ${dtObj.minutes} ${dtObj.hours} ${new Date(r.endTime).getDate()} ${new Date(r.endTime).getMonth()+1} *`
        //     job = new CronJob(cronString, function () {
        //         console.log('You will see this message for r being:', r);
        //         ws.send(`sending cron job data based on ${r.id}`);
        //     }, null, true);
        //     job.start();
        //     console.log("message", message);
        // })
        console.log("registering manaul trigger of cron job--message::", message, "getTZLabel.getTZLabel(-330)", tzHelpers.getTZLabel(-330));
        let timezone = tzHelpers.getTZLabel(-330)
        job = cron.schedule('* 57 9 25 5 *', () =>  {
            console.log('scheduled task on * 30 9 25 5 *--> need to make this dynamic');
            ws.send(`sending cron job data based`);
          }, {
            scheduled: false,
            timezone
          });
           
        job.start();
    }
}

exports.set = function (ws) {
    ws.on('message', function incoming(message) {
        if (typeof message != "string") {
            let data = JSON.parse(message);
            const {
                user_id,
                project_id
            } = data;
            // TODO: REMOVE THIS AFTER TESTING
            // Project.find({ user_id: user_id, isTask: false, _id: project_id }).exec(function (err, result) {
            //     console.log("founnd list:", result);
            //     // get tasks from result
            //     if (result && result[0] && result[0]._doc) {
            //         let tasks = result[0]._doc.tasks;
            //         if (tasks != null) {
            //             // if tasks exist for this found project id
            //             // get tasks keys
            //             let taskIdsArr = Object.keys(tasks);
            //             // push the starttime, endtime, taskId into remindersArray
            //             taskIdsArr.forEach(taskId => {
            //                 console.log(tasks[taskId].endTime);
            //                 remindersArray.push({
            //                     taskId,
            //                     startTime: tasks[taskId].startTime,
            //                     endTime: tasks[taskId].endTime
            //                 });
            //             });
            //         }
            //         if (err) throw err;
            //         handleReminders(remindersArray, ws, message);
            //     }
            // });
            handleReminders(remindersArray, ws, message);
        } else {
            handleReminders(remindersArray, ws, message);
        }
    });
}