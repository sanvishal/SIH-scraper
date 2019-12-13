const scrapePages = require("./scraper");

let from = parseInt(process.argv[process.argv.length - 2]),
  to = parseInt(process.argv[process.argv.length - 1]);
scrapePages.scrape(from, to);
