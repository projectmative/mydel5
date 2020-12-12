const mongoose = require("mongoose");
const CatogrySchema = new mongoose.Schema({
  catogry: {
    type: String,

  },
  subcatogry: [
    {
        type: String,
    }
  ],

});

module.exports = Catogry = mongoose.model("Catogry", CatogrySchema);
