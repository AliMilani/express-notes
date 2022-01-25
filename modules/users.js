const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Users = mongoose.model(
    "Users",
    new mongoose.Schema({
        name: {
            type: String,
            default: "",
            minlength: 0,
            maxlength: 50,
            trim: true,
        },
        nickname: {
            type: String,
            default: function () {
                if (this.name) return this.name;
                return this.email.split("@")[0];
            },
            minlength: 0,
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

validateUsers = {
    usersSchema: Joi.object({
        name: Joi.string().min(0).max(50),
        nickname: Joi.string().min(0).max(50),
        email: Joi.string().min(7).max(320).required().email(),
        phone: Joi.string().min(10).max(15).required().regex(/^(?=^09)\b\d{11}\b/),
        password: Joi.string().min(7).max(225).required(),
    }),

    makeSchemaOptional(schema) {
        let usersSchemaFields = schema._ids._byKey[Symbol.iterator]();
        let usersFelids = [];
        for (let field of usersSchemaFields) {
            usersFelids.push(field[0]);
        }
        return schema.fork(usersFelids, (field) => field.optional());
    },

    post(user) {
        return this.usersSchema.validate(user);
    },

    put(user) {
        return this.makeSchemaOptional(this.usersSchema).validate(user);
    },
};

exports.Users = Users;
exports.validate = validateUsers;
