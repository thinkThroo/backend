var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    created_at: {type: Date},
    updated_at: {type: Date},
    start: {type: Date},
    end: {type: Date},
    attachments: [String],
    is_subtask: Boolean,
    sub_tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}]
})

//Export model
module.exports = mongoose.model('Task', TaskSchema);