var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var WikiSchema = new Schema({
    id: { type: Schema.Types.ObjectId },
    user_id: { type: Schema.Types.ObjectId, required: true },
    date: { type: Date },
    created_at: { type: Date },
    updated_at: { type: Date },
    name: { type: String },
    map: { type: Object }
});

//Export model
module.exports = mongoose.model('WikiSchema', WikiSchema);