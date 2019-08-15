#!/usr/bin/env node

'use strict';

/**
 * Created by Thomas Sham on 25/5/2017.
 */

const util = require('util');

const CLIProgram = require('commander');

const HKACrawler = require("./crawler/app");

const crawlers = [
    new HKACrawler("passengers", "arrival"),
    new HKACrawler("passengers", "departure"),
    new HKACrawler("cargo", "arrival"),
    new HKACrawler("cargo", "departure")
];

CLIProgram.version('1.0.0');

CLIProgram
    .option("-d, --dest <path>", "destination folder of the crawler output")

    .option("-f, --format <format>", "format with which the crawled data are to be saved")

    .option("-a, --all", "run all four crawlers (arriving and departing for passenger flights and arriving and departing for cargo flights)")

    .option("-t, --type <type>", "set type of flight (passenger or cargo)")

    .option("-arr, --arrival", "crawl arriving flights only")
    .option("-dep, --departure", "crawl departing flights only");


CLIProgram.parse(process.argv);

console.log("Hong Kong International Airport Flight Information Crawler");
console.log("Version: 1.0.0");

if (CLIProgram.dest){
    console.log("  - path", CLIProgram.dest);
}

if (CLIProgram.all){
    console.log("  - all");
}else{
    if (CLIProgram.type) {
        console.log("  - type", CLIProgram.type);
    }

    if (CLIProgram.arrival) {
        console.log("  - arrival only");
    }

    if (CLIProgram.departure) {
        console.log("  - departure only");
    }
}

crawlers[0].crawlHKIAWebsite("2017-10-30").then(res => {
    console.log(util.inspect(res, {
        showHidden: false,
        maxArrayLength: 100,
        depth: null
    }));
}).catch(err => {
    console.log(err);
});