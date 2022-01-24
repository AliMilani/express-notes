const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const uniqueValidator = require('mongoose-unique-validator');

const Users = mongoose.model(
    "Users",
    new mongoose.Schema({
        name: {
            type: String,
            default: "",
            minlength: 1,
            maxlength: 50,
            trim: true,
        },
        nickname: {
            type: String,
            default: function () {
                if (this.name) return this.name;
                return this.email.split("@")[0];
            },
            minlength: 1,
            maxlength: 50,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            minlength: 7,
            maxlength: 320,
            trim: true,
            unique: true,
            validate: {
                validator: function (v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: "Please enter a valid email address",
            },
        },
        phone: {
            type: String,
            maxlength: 15,
            trim: true,
            minlength: 10,
            required: true,
            unique: true,
            vlaidate: {
                validator: function (v) {
                    return /(?=^09)\b\d{11}\b/.test(v);
                },
                message: "Please enter a valid phone number",
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 7,
            maxlength: 225,
            set: (v) => bcrypt.hashSync(v, 10),
        },
        phoneVerified: {
            type: Boolean,
            default: false,
        },
        registerDate: {
            type: Date,
            default: Date.now,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
    })
);
// Users.plugin(uniqueValidator);

validateUsers = {
    usersCommonFields = {
        name: Joi.string().min(1).max(50),
        nickname: Joi.string().min(1).max(50),
        email: Joi.string().min(7).max(320).required().email(),
        phone: Joi.string().min(10).max(15).required().regex(/^(?=^09)\b\d{11}\b/),
        password: Joi.string().min(7).max(225).required(),
    },
    usersSchema = Joi.object({
        ...usersCommonFields,
    }),

    post(user) {
        return usersSchema.validate(user);
    },

    put(user) {
        return usersSchema.fork(Object.keys(usersCommonFields), schema => schema.optional()).validate(user);
    }
}

exports.Users = Users;
exports.validate = validateUsers;