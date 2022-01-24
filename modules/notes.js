const Joi = require("joi");
const mongoose = require("mongoose");

const Notes = mongoose.model(
    "Notes",
    new mongoose.Schema({
        title: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 255,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 90000,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        author: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 255,
            trim: true,
        },
        primaryLink: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 255,
            trim: true,
            unique: true,
            lowercase: true,
            default: function () {
                return this.title
                    .replace(/[^a-zA-Z0-9ا-ی\s\_\-\.]/g, "")
                    .replace(/[\s.]/g, "-")
                    .toLowerCase();
            },
            set: function (value) {
                return value
                    .replace(/[^a-zA-Z0-9ا-ی\s\_\-\.]/g, "")
                    .replace(/[\s.]/g, "-")
                    .toLowerCase();
            },
        },
        publishDate: {
            type: Date,
            default: Date.now,
        },
        updateDate: {
            type: Date,
            default: Date.now,
        },
    })
);

validateNote = (note) => {
    const schema = {
        title: Joi.string().min(1).max(255).required(),
        content: Joi.string().min(1).max(90000).required(),
        isPublished: Joi.boolean(),
        author: Joi.string().min(1).max(255).required(),
        primaryLink: Joi.string().min(1).max(255),
    };
    return Joi.validate(note, schema);
};

exports.Notes = Notes;
exports.validate = validateNote;
