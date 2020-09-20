const gh = require("gh-pages");

gh.publish("./dist", function (e) {
  if (e) {
    throw e;
  }

  console.log("Success publish");
});
