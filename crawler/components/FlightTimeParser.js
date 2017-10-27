/**
 * Created by Thomas Sham on 25/5/2017.
 */

const moment = require('moment-timezone');

let FlightTimeParser = (rawObj, rootMoment) => {
    let scheduledDateTime = moment(rootMoment);
    scheduledDateTime.hour(rawObj.time.split(":")[0]);
    scheduledDateTime.minute(rawObj.time.split(":")[1]);
    return scheduledDateTime.format();
};

module.exports = FlightTimeParser;