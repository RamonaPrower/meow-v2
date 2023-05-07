// this function builds the strings for the output, based on a schema and if all options are present on other skins
// so if the "New" skin is missing a string, it will use the default one
// this is to make it easier to add new skins

const strings = require('../strings/strings.json');

// use default skin as the base
const defaultSkin = strings.default;

function buildStrings(skin = 'default') {
    const builtStrings = {};
    // first check if the skin exists, as it can be changed by the user
    if (!strings[skin]) {
        skin = 'default';
    }
    // get the requested skin from the strings
    const skinStrings = strings[skin];
    // loop through the default skin
    Object.keys(defaultSkin).forEach((key) => {
        // if the skin has the key, use it
        if (skinStrings[key]) {
            builtStrings[key] = skinStrings[key];
        }
 else {
            // otherwise use the default one
            builtStrings[key] = defaultSkin[key];
        }
    });
    return builtStrings;
}

module.exports = {
    buildStrings,
};
