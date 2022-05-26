const classes = { bm: require("./classes/bootmanager") };
const bm = new classes.bm();
require("colors");

bm.check("./systems/identifiers.json").then((app) => {
  console.log(app.msg.toString().green);
  bm.boot(process.argv[2]);
});
