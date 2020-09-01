const reddit = require("./src/tasks/reddit");

(async () => {
  await reddit.initialize("node");

  let results = await reddit.getResults(30);

  debugger;
})();
