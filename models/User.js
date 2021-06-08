const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Minimun password length is 6 characters"]
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

// fire function before user is saved to db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
});

// fire function before user is updated in db
userSchema.pre('findOneAndUpdate', async function (next) {
    if (this._update.password) {
        const salt = await bcrypt.genSalt();
        this._update.password = await bcrypt.hash(this._update.password, salt)
    }
    next();
});

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email: email, is_deleted: false });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            let result = user.toJSON();
            delete result.password;
            delete result.__v;
            return result;
        }
        throw Error("Incorrect password");
    }
    throw Error("Incorrect email")
}

const User = mongoose.model('user', userSchema);

module.exports = User;