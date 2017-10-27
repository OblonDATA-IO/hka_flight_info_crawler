/**
 * Created by Thomas Sham on 25/5/2017.
 */

const moment = require('moment-timezone');

let FlightStatusParser = (rawObject) => {
    let returnObj = {
        completed: false,
        actualDateTime: null
    };
    let flightStatus = rawObject.status.split(" ");
    if (flightStatus.length >= 2){
        // There is status available
        let recordDate;

        // TODO: change to regular expression
        switch (flightStatus[0].toLowerCase()){
            case "dep":
                returnObj.completed = true;
                if (flightStatus.length > 2){
                    // next day
                    recordDate = moment.tz(flightStatus[flightStatus.length - 1], "DD-MM-YYYY", "Asia/Hong_Kong");
                }else{
                    //same day
                    recordDate = moment(rawObject.scheduledDateTime);
                }
                recordDate.hour(flightStatus[1].split(":")[0]);
                recordDate.minute(flightStatus[1].split(":")[1]);
                returnObj.actualDateTime = recordDate.format();
                break;
            case "est":

                break;
            case "at":
                returnObj.completed = true;
                if (flightStatus.length > 3){
                    // next day
                    recordDate = moment.tz(flightStatus[flightStatus.length - 1], "DD-MM-YYYY", "Asia/Hong_Kong");
                }else{
                    //same day
                    recordDate = moment(rawObject.scheduledDateTime);
                }
                recordDate.hour(flightStatus[2].split(":")[0]);
                recordDate.minute(flightStatus[2].split(":")[1]);
                returnObj.actualDateTime = recordDate.format();
                break;
        }
    }
    return returnObj;
};

module.exports = FlightStatusParser;