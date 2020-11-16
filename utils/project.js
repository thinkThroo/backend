exports.getUpdateData = function(project) {
    // return {
    //         user_id: project.user_id,
    //         workspace_id:  project.workspace_id,
    //         projectType: project.projectType,
    //         date: project.date,
    //         title: project.title,
    //         description: project.description,
    //         outcome: project.outcome,
    //         reward: project.reward,
    //         startTime: project.startTime,
    //         endTime: project.endTime,
    //         label: project.label,
    //         status: project.status,
    //         tasks: project.tasks,
    //         map: project.map,
    //         isTask: project.isTask,
    //         offsetForTz: project.offsetForTz
    // }
    let keys = Object.keys(project), updatedData = {};
    keys.forEach(k => {
        updatedData[k] = project[k];
    });
    return updatedData;
}