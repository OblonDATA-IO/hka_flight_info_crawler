/**
 * Created on 25th May 2017.
 * Updated on 16th August 2019 for the new REST API.
 */

const request = require("request-promise-native");

import { format } from "date-fns";

function UrlGenerator(
    isCargo = false,
    isArrival = false,
) {
    return (
        date = format(new Date(), "YYYY-MM-DD"),
        span = 1,
    ) => `https://www.hongkongairport.com/flightinfo-rest/rest/flights?span=${ span }&date=${ date }&lang=en&cargo=${ isCargo ? "true" : "false" }&arrival=${ isArrival ? "true" : "false" }`;
}

module.exports = class HKACrawler {
    constructor (
        mode = "passengers",
        type = "departure"
    ) {
        this.urlGenerator = UrlGenerator(mode !== "passengers", type !== "departure")
    }

    crawl (
        dateTime,
        span
    ) {
        return new Promise(
            async (resolve, reject) => {
                let results;
                try {
                    results = await request(this.urlGenerator(dateTime, span));
                } catch (e) {
                    console.error(e);
                    reject(e);
                    return;
                }


            }
        );
    }
};
