const mongoose = require('mongoose');

const facebookFeedSchema = new mongoose.Schema(
  {
    post_id: { type: String, required: true, unique: true },
    message: { type: String },
    created_time: { type: Date, required: true },
    permalink_url: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FacebookFeed', facebookFeedSchema);
