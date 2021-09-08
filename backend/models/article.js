const mongoose = require('mongoose');

function chkStringLength(string, minAlphabets) {
    const chkAlphabets = /[a-zA-Z]/g;
    const no_of_alphabets = (string.match(chkAlphabets) || []).length;
    return no_of_alphabets > minAlphabets;
}

function chkOtherChars(string) {
    const chkSpclChars = /(?![\s\.-])\W|\n|\t|\r/g;    // it wont chk spaces, -, _, .
    const chkAllowedSpclChars = /\s{2,}|\.{2,}|-{2,}|_{2,}/g;
    return !(chkSpclChars.test(string) || chkAllowedSpclChars.test(string));
}

const articleSchema = mongoose.Schema({
    username: { type: String, trim: true, maxLength: 20, validate: data => chkStringLength(data,3) && chkOtherChars(data) },
    title: { type: String, trim: true, maxLength: 25, validate: data => chkStringLength(data,5) && chkOtherChars(data) },
    originalDesc: { type: String, trim: true, maxLength: 4000, validate: data => chkStringLength(data,500) },
    markdown: { type: String, trim: true, maxLength: 2000, validate: data => chkStringLength(data,20) },

    modifiedDesc: { type: String, required: true },
    sanitizedHtml: { type: String, required: true },
    displayDate: { type: String, required: true },
    likes: { type: Number, default: 0 },

}, { timestamps: true } );

module.exports = mongoose.model('article',articleSchema);

