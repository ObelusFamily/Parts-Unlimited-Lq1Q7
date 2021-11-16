const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);
mongoose.set("debug", true);

require("./User");
require("./Item");
require("./Comment");

