const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
        minlength: 2
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
        minlength: 2
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 30,
        minlength: 3,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxLength: 11,
        minlength: 9
    },
    role: {
        type: String,
        enum: ['blogger', 'admin'],
        default: 'blogger'
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    bio: {
        type: String
    },
    avatar: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);