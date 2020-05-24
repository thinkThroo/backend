exports.getUpdateData = function(project) {
    return {
            date: project.date,
            title: project.title,
            description: project.description,
            outcome: project.outcome,
            reward: project.reward,
            startTime: project.startTime,
            endTime: project.endTime,
            label: project.label,
            status: project.status,
            tasks: project.tasks,
            map: project.map,
            isTask: project.isTask
    }
}