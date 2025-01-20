const mongoose = require('mongoose');

const instagramPostSchema = new mongoose.Schema(
  {
    media_id: { type: String, required: true, unique: true },
    caption: { type: String },
    media_type: { type: String },
    media_url: { type: String },
    thumbnail_url: { type: String },
    permalink: { type: String },
    timestamp: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InstagramPost', instagramPostSchema);
