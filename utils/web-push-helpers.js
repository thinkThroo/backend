const webPush = require('web-push');

const wpKeys = webPush.generateVAPIDKeys();

console.log("woKeys:", wpKeys);