const cheerio = require("cheerio");
const axios = require("axios");

const fs = require("fs");
const path = require("path");

let data_file = fs.readFileSync(path.resolve(__dirname, "data.json"), "utf8");
let obj = JSON.parse(data_file);

let top_url = "https://www.sih.gov.in/sih2020PS";

const scrape = async (page = 1, cb) => {
  const URL = `${top_url}?page=${page}`;

  await axios.get(URL).then(res => {
    const $ = cheerio.load(res.data);
    let rows = $(".intro").find("tr");

    rows.each((i, ele) => {
      content = {};
      $(ele)
        .find(".colomn_border")
        .each((i, ele) => {
          let el = $(ele);
          switch (i) {
            case 1:
              content["Company"] = el.text();
              break;
            case 2:
              content["Statement"] = el.find("a").text();
              break;
            case 3:
              content["Category"] = el.text();
              break;
            case 4:
              content["PS No."] = el.text();
              break;
            case 5:
              content["Domain"] = el.text();
              break;
          }

          if (i === 2) {
            el.find("td").each((tdi, tdees) => {
              let td = $(tdees);
              switch (tdi) {
                case 0:
                  content["Description"] = td
                    .find("div")
                    .text()
                    .replace(/\r?\n|\r/g, "")
                    .replace(/\t/g, "");
                  break;
                case 4:
                  content["Youtube"] = td.find("a").text();
                  break;
              }

              if (tdi === 5) {
                if (td.find("a").text() !== "") {
                  content["Dataset"] = td.find("a").text();
                }
              }
            });
          }
        });
      if (Object.keys(content).length) {
        obj.data.push(content);
      }
    });
    let json = JSON.stringify(obj);
    try {
      fs.writeFileSync(path.resolve(__dirname, "data.json"), json, "utf8");
      return cb("done");
    } catch (err) {
      return cb("Whoopsies " + err);
    }
  });
};

module.exports = {
  scrape
};
