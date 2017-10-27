/**
 * Created by Thomas Sham on 25/5/2017.
 */

const util = require('util');

const HKACrawler =  require("./crawler/app");
const crawler = new HKACrawler("passengers", "arrival");

crawler.crawlHKIAWebsite("2017-10-26").then(res => {
    console.log(util.inspect(res, {
        showHidden: false,
        maxArrayLength: 10,
        depth: null
    }));
}).catch(err => {
    console.log(err);
});