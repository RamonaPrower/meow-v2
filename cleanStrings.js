// use this file to sort the strings in strings.json
// each top level key is a "Theme", each entry per theme is a "action"
// all actions should be sorted alphabetically, and the themes should be sorted alphabetically
// then write to a new file

const fs = require('fs');
const path = require('path');

const strings = require('./strings/strings.json');

const newStrings = {};

Object.keys(strings).sort().forEach((key) => {
  newStrings[key] = {};
  Object.keys(strings[key]).sort().forEach((key2) => {
    newStrings[key][key2] = strings[key][key2];
  });
});

fs.writeFile(path.join(__dirname, 'strings2.json'), JSON.stringify(newStrings, null, 2), (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});