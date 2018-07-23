const msc = require('./../index');

msc.populateFromCSV(
    [
        './test/location.csv',
        {path: './test/map.csv', model: 'Map', parseOptions: {columns: true}}
    ],
    {columns: true});
