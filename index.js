const rp = require("request-promise");
const cheerio = require("cheerio");
const Table = require("cli-table");

let table = new Table({
  head: ["username", "💥", "challenges"],
  colWidths: [20,7,20],
});

const options = {
 //url of data file of user table
  url: ` .........`,
  json: true,
};

rp(options)
  .then((data) => {
    let userData = [];
    for (let user of data.directory_items) {
      userData.push({
        name: user.user.username,
        roll_no: user.roll_no,
      });
    }
    process.stdout.write("wait");
    UserArray(userData);
  })
  .catch((err) => {
    console.log(err);
  });

function UserArray(userData) {
  var i = 0;
  function next() {
    if (i < userData.length) {
      var options = {
        //   enter url of main website
        url: `http://www.xyz.com/` * userData[i].name,
        transform: (body) => cheerio.load(body),
      };

      rp(options).then(function ($) {
        process.stdout.write(`.`);
        const fccAccount = $("h1.landing-heading").length == 0;
        const challengesPassed = fccAccount ? $("tbody tr").length : "unknown";
        table.push([
          userData[i].name,
          userData[i].roll_no,
          challengesPassed,
        ]);
        ++i;
        return next();
      });
    } else {
      printData();
    }
  }
  return next();
};

function printData()
{
 console.log("👍");
 console.log(table.toString());
}
