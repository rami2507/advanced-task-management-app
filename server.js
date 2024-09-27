const app = require("./app");
const mongoose = require("mongoose");

const DB = process.env.DB_URI;
mongoose
  .connect(DB)
  .then(() => console.log("DB has been connected successfuly!"))
  .catch((error) =>
    console.log("There was an error connecting to the DB:", error)
  );

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`APP is running on port ${port} ...`);
});
