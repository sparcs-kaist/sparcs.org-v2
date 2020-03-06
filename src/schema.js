const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const yearSchema = new Schema({
    year: Number,
    eventNumber: Number,
    photoNumber: Number
});

const albumSchema = new Schema({
    year: Number,
    title: String,
    date: String,
    folderName: String,
    photoNumber: Number,
    photos: [String]
});

const seminarSchema = new Schema({
    title: String,
    speaker: String,
    date: Date,
    sources: [String]
});
seminarSchema.index({ date: -1 });

const memberSchema = new Schema({
    id: { type: String, unique: true, lowercase: true },
    name: String,
    is_developer: Boolean,
    is_designer: Boolean,
    is_undergraduate: Boolean,
    is_private: Boolean,
    github_id: String,
    linkedin_url: String,
    behance_url: String,
    website: String,
    ignore: Boolean
});

const notificationSchema = new Schema({
    title: String,
    content: String,
    raw: Boolean,
    level: Number
});

const memberAttrSchema = new Schema({
    id: { type: String, unique: true, lowercase: true },
    admin: Boolean,
    ignore: Boolean
});
memberAttrSchema.index({ id: 1 });

const optionsSchema = new Schema({
    key: { type: String, unique: true },
    value: String
});
optionsSchema.index({ key: 1 });

exports.Years = mongoose.model('Years', yearSchema);
exports.Albums = mongoose.model('Albums', albumSchema);
exports.Seminars = mongoose.model('Seminars', seminarSchema);
exports.Members = mongoose.model('Members', memberSchema);
exports.Notifications = mongoose.model('Notifications', notificationSchema);
exports.MemberAttrs = mongoose.model('MemberAttrs', memberAttrSchema);
exports.Options = mongoose.model('Options', optionsSchema);
