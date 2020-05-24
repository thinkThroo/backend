var mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    user_name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date }
})

UserSchema.pre('save', function (next) {
    console.log("this is UserSchema", this);
    // Check if document is new or a new password has been set
    // if (this.isNew || this.isModified('password')) {
    bcrypt.hash(this.password, saltRounds,
        (err, hashedPassword) => {
            if (err) {
                next(err);
            }
            else {
                this.password = hashedPassword;
                next();
            }
        });
    // } else {
    //   next();
    // }
});

UserSchema.methods.isCorrectPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}

//Export model
module.exports = mongoose.model('User', UserSchema);
