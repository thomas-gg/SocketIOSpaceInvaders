const moment = require('moment');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}

module.exports = formatMessage;
/* Syntax for ES6 so same as 
username:username,
text:text,
time:... */