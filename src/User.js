const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        uniqued: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const User = model('user', UserSchema);

mongoose.model = User;