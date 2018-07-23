const _ = require('lodash');
const csvParse = require('csv-parse');
const fs = require('fs');
const path = require('path');

let seeder = require('mongoose-seed');

parseCSV = function (data, options) {
    return new Promise((resolve, reject) => {
        csvParse(data, options, function (err, ret) {
            if (err !== null) return reject(err);
            resolve(ret);
        })
    })
};

modelName = function (filepath) {
    return path.parse(filepath).name;
};

/**
 * @typedef {object} CSV_Entry
 * @property {string} path - csv file path
 * @property {string} [model] - model name
 * @property {string} [parseOption] - individual parse option (it will override csvParseOption)
 */

/**
 * @param {[CSV_Entry || string]} csvEntry - csv entry or csv file paths
 * @param {object} [csvParseOption] - csv parse option, see: https://github.com/adaltas/node-csv-parse
 * @param {function} [cb] - callback function see: https://github.com/seanemmer/mongoose-seed
 *
 * @returns {Promise<>}
 */
seeder.populateFromCSV = async function (csvEntry, csvParseOption, cb) {
    let data = [];
    for (let csvItem of csvEntry) {
        let modelData = {};
        if (typeof csvItem === 'string') {
            const content = fs.readFileSync(path.resolve(csvItem), 'utf-8');
            modelData.model = modelName(csvItem);
            modelData.documents = await parseCSV(content, csvParseOption || {});
        } else if (typeof csvItem === 'object'
            && csvItem.hasOwnProperty('path')) {
            const content = fs.readFileSync(path.resolve(csvItem.path), 'utf-8');
            modelData.model = csvItem.model || modelName(csvItem.path);
            modelData.documents = await parseCSV(content, csvItem.parseOption || csvParseOption || {});
        } else {
            return;
        }
        data.push(modelData);
    }

    // console.log(data);
    return new Promise((resolve, reject) => {
        seeder.populateModels(data, (err, data) => {
            if(err){
                return reject(err);
            }
            cb(err, data);
            resolve(data);
        });
    });
};

module.exports = seeder;