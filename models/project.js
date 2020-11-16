var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    // title: {type: String, required: true},
    // description: {type: String},
    // created_at: {type: Date},
    // updated_at: {type: Date},
    // start: {type: Date},
    // end: {type: Date},
    // attachments: [String],
    // is_subtask: Boolean,
    // sub_tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}],
    // fresh
    id: { type: Schema.Types.ObjectId },
    user_id: { type: Schema.Types.ObjectId, required: true },
    workspace_id: { type: Schema.Types.ObjectId, required: true },
    projectType: { type: String, default: "map" },
    date: { type: Date },
    title: {
        parentKey: { type: String },
        topicKey: { type: String },
        quillText: { type: String }
    },
    description: {
        parentKey: { type: String },
        topicKey: { type: String },
        quillText: { type: String }
    },
    outcome: {
        parentKey: { type: String },
        topicKey: { type: String },
        quillText: { type: String }
    },
    reward: {
        parentKey: { type: String },
        topicKey: { type: String },
        quillText: { type: String }
    },
    startTime: { type: Date },
    endTime: { type: Date },
    label: { type: String },
    status: { type: String },
    tasks: { type: Object, ref: 'Project' },
    created_at: { type: Date },
    updated_at: { type: Date },
    map: { type: Object },
    roadmap: { type: Object },
    isTask: { type: Boolean },
    offsetForTz: { type: Number }
})

//Export model
module.exports = mongoose.model('Project', ProjectSchema);