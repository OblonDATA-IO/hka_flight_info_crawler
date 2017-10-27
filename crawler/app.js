/**
 * Created by Thomas Sham on 25/5/2017.
 */

const request = require("request-promise-native");

const cheerio = require("cheerio");

const moment = require("moment-timezone");

const FlightTimeParser = require("./components/FlightTimeParser");
const FlightNoParser = require("./components/FlightNoParser");
const FlightStatusParser = require("./components/FlightStatusParser");

const urls = {
    passengers: {
        departure: "https://www.hongkongairport.com/flightinfo/eng/real_depinfo.do?fromDate=",
        arrival: "https://www.hongkongairport.com/flightinfo/eng/real_arrinfo.do?fromDate="
    },
    cargo: {
        departure: "https://www.hongkongairport.com/flightinfo/eng/cargo_depinfo.do?fromDate=",
        arrival: "https://www.hongkongairport.com/flightinfo/eng/cargo_arrinfo.do?fromDate="
    }
};

const dataObjectTemplates = {
    passengers: {
        departure: {
            "time": "",
            "flight_no": "",
            "dest": "",
            "terminal": "",
            "aisle": "",
            "gate": "",
            "airline": "",
            "status": ""
        },
        arrival: {
            "time": "",
            "flight_no": "",
            "origin": "",
            "airline": "",
            "hall": "",
            "status": ""
        }
    },
    cargo: {
        departure: {
            "time": "",
            "flight_no": "",
            "dest": "",
            "airline": "",
            "status": ""
        },
        arrival: {
            "time": "",
            "flight_no": "",
            "origin": "",
            "airline": "",
            "status": ""
        }
    }
};

module.exports = class HKACrawler {
    constructor (mode = "passengers", type = "arrival") {
        this.mode = mode;
        this.type = type;
    }

    crawlHKIAWebsite (dateTime){
        let requiredDateTime = moment(dateTime, "YYYY-M-DD");
        return new Promise((resolve, reject) => {
            request(urls[this.mode][this.type] + requiredDateTime.format("YYYY-M-DD")).then(
                (htmlString) => {
                    let data = [];
                    let $ = cheerio.load(htmlString);
                    let rootRecordDate;
                    $("tr").each((ind, ele) => {
                        let temp = Object.assign({}, dataObjectTemplates[this.mode][this.type]);

                        if (!!$(ele).attr("date")){
                            let date = $(ele).attr("date").split(",");
                            rootRecordDate = moment.tz(date[date.length - 1], "YYYY-MM-DD", "Asia/Hong_Kong").format();
                        }

                        let validFlag = true;
                        for (let i = 0; i < ele.children.length; i++){
                            if (!$(ele.children[i]).text()){
                                // break out from the loop if the text is empty
                                i = ele.children.length;
                                validFlag = false;
                            } else temp[Object.keys(temp)[i]] = $(ele.children[i]).text();
                        }

                        //console.log(temp);

                        if (validFlag){
                            temp.scheduledDateTime = FlightTimeParser(temp, rootRecordDate);
                            delete temp.time;

                            temp.flight_nos = FlightNoParser(temp);
                            delete temp.airline;
                            delete temp.flight_no;

                            temp = Object.assign(temp, FlightStatusParser(temp));
                            delete temp.status;

                            temp.mode = this.mode;
                            temp.type = this.type;

                            data.push(temp);
                        }
                        //return false;
                    });
                    resolve(data);
                },
                err => {
                    reject(err);
                }
            );
        });
    }
};