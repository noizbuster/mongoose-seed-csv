# mongoose-seed-csv
mongoose-seed-csv is a wrapper for mongoose-seed that will parse data from csv files

## Usage
```javascript
const seeder = require('mongoose-seed-csv');
seeder.populateFromCSV(
    [
        './test/location.csv',
        {path: './test/map.csv', model: 'Map', parseOptions: {columns: true}}
    ],
    {columns: true},
    function(){
        seeder.disconnect();
    });
```

## Methods
### seeder.populateFromCSV(csvEntryArray, [csvParseOptions], [callback])
* csvEntryArray: [string(filepath) || CSV_Entry]
    * you can you both filepath and CSV_Entry Object and even mixed
* csvParseOptions
    * see: [options for cvs-parse](https://github.com/adaltas/node-csv-parse)
* callback
    * same callback as in [mongoose-seed's](https://github.com/seanemmer/mongoose-seed) [populateModels](https://github.com/seanemmer/mongoose-seed/blob/master/README.md#seederpopulatemodelsdataarray-callback)
## CSV_EntryObject
```javascript
/**
 * @typedef {object} CSV_Entry
 * @property {string} path - csv file path
 * @property {string} [model] - model name
 * @property {string} [parseOptions] - individual parse option (it will override csvParseOption)
 */
```

# Dependencies
* [mongoose-seed](https://github.com/seanemmer/mongoose-seed)
* [csv-parse](https://github.com/adaltas/node-csv-parse)
