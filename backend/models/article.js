const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

// function chkStringLength(string, minlen, maxlen) {
function chkStringLength(string, minAlphabets) {
    // console.log('string',string);
    const chkAlphabets = /[a-zA-Z]/g;
    // const no_of_alphabets = (string.match(chkAlphabets) || []).length;
    // return !(no_of_alphabets < minlen || no_of_alphabets > maxlen);
    const no_of_alphabets = (string.match(chkAlphabets) || []).length;
    return no_of_alphabets > minAlphabets;
}

function chkOtherChars(string) {
    // console.log('string',string);
    // const chkSpclChars = /(?![\s-])\W|\n|\t|\r/g;
    // const chkSpclChars = /(?![\s-])\W/g;    // \n,\t,\r will be covered in \s in below regexp
    // const chkSpaces = /\s{2,}/g;
    // const chkSpclChars = /(?![\s\.-])\W|\n/g;    // \t,\r will be covered in \s in below regexp
    const chkSpclChars = /(?![\s\.-])\W|\n|\t|\r/g;    // it wont chk spaces, -, _, .
    const chkAllowedSpclChars = /\s{2,}|\.{2,}|-{2,}|_{2,}/g;
    // const chkSpaces = /\s{2,}|\.{2,}|-{2,}|_{2,}|\n|\t|\r/g;
    // if((chkSpclChars.test(string)) || (chkSpaces.test(string))) return false;
    return !(chkSpclChars.test(string) || chkAllowedSpclChars.test(string));
}

const articleSchema = mongoose.Schema({
    // username: { type: String, minLength: 3, maxLength: 20, trim: true, validate: value => validator(value) },
    // title: { type: String, minLength: 5, maxLength: 25, trim: true, validate: value => validator(value) },
    // originalDesc: { type: String, minLength: 50, maxLength: 250, trim: true },
    // markdown: { type: String, minLength: 20, maxLength: 120, trim: true },
    // username: { type: String, trim: true, validate: data => chkOtherChars(data) && chkStringLength(data,3,15) },
    // title: { type: String, trim: true, validate: data => chkOtherChars(data) && chkStringLength(data,20,5) },
    // originalDesc: { type: String, trim: true, validate: data => chkStringLength(data,50,200) },
    // markdown: { type: String, trim: true, validate: data => chkStringLength(data,20,70) },
    // username: { type: String, trim: true, validate: data => chkStringLength(data,3,15) && chkOtherChars(data) },
    // title: { type: String, trim: true, validate: data => chkStringLength(data,5,20) && chkOtherChars(data) },
    // originalDesc: { type: String, trim: true, validate: data => chkStringLength(data,50,200) },
    // markdown: { type: String, trim: true, validate: data => chkStringLength(data,20,70) },

    username: { type: String, trim: true, maxLength: 20, validate: data => chkStringLength(data,3) && chkOtherChars(data) },
    // username: { type: String, trim: true, maxLength: 20 },
    title: { type: String, trim: true, maxLength: 25, validate: data => chkStringLength(data,5) && chkOtherChars(data) },
    // title: { type: String, trim: true, maxLength: 25 },
    originalDesc: { type: String, trim: true, maxLength: 4000, validate: data => chkStringLength(data,500) },
    markdown: { type: String, trim: true, maxLength: 2000, validate: data => chkStringLength(data,20) },

    modifiedDesc: { type: String, required: true },
    sanitizedHtml: { type: String, required: true },
    displayDate: { type: String, required: true },
    likes: { type: Number, default: 0 },

}, { timestamps: true } );

// articleSchema.plugin(uniqueValidator);

// export default mongoose.model('product',productSchema);
module.exports = mongoose.model('article',articleSchema);

