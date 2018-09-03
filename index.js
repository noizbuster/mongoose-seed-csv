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
 * @property {string} [parseOptions] - individual parse option (it will override csvParseOption)
 */

/**
 * @param {[CSV_Entry || string]} csvEntry - csv entry or csv file paths
 * @param {object} [csvParseOptions] - csv parse option, see: https://github.com/adaltas/node-csv-parse
 * @param {boolean} [csvParseOptions.parseDeep] - if true, the parser try to parse each value as JSON
 * @param {function} [cb] - callback function see: https://github.com/seanemmer/mongoose-seed
 *
 * @returns {Promise<>}
 */
seeder.populateFromCSV = async function (csvEntry, csvParseOptions, cb) {
    let data = [];
    for (let csvItem of csvEntry) {
        let modelData = {};
        if (typeof csvItem === 'string') {
            const content = fs.readFileSync(path.resolve(csvItem), 'utf-8');
            modelData.model = modelName(csvItem);
            modelData.documents = await parseCSV(content, csvParseOptions || {});
        } else if (typeof csvItem === 'object'
            && csvItem.hasOwnProperty('path')) {
            const content = fs.readFileSync(path.resolve(csvItem.path), 'utf-8');
            modelData.model = csvItem.model || modelName(csvItem.path);
            modelData.documents = await parseCSV(content, csvItem.parseOptions || csvParseOptions || {});
        } else {
            return;
        }
        if (csvParseOptions.parseDeep) {
            modelData.documents = _.map(modelData.documents, (doc) => {
                return _.mapValues(doc, (value) => {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        return value;
                    }
                })
            });
        }
        data.push(modelData);
    }

    return new Promise((resolve, reject) => {
        console.log('TEMP: start populate with data', JSON.stringify(data, null, 4));
        seeder.populateModels(data, (err, data) => {
            if (err) {
                console.log('TEMP: err', err)
                return reject(err);
            }
            cb(err, data);
            resolve(data);
        });
    });
};

module.exports = seeder;
