const scraper = require("./scrape");

module.exports = {
  scrape: async (minPages = 1, maxPages = 1) => {
    for (let i = minPages; i <= maxPages; i++) {
      await scraper.scrape(i, res => {
        console.log(`page ${i} has been scraped`);
      });
    }
  }
};
