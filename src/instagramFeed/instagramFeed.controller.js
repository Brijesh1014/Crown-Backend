const axios = require('axios');
const InstagramPost = require('./instagramFeed.model');

const getInstagramFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const cachedPosts = await InstagramPost.find()
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (cachedPosts.length > 0) {
      return res.status(200).json({
        success: true,
        data: cachedPosts,
        message: 'Fetched from local cache'
      });
    }

    const response = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    );

    const posts = response.data.data;

    const bulkOps = posts.map((post) => ({
      updateOne: {
        filter: { media_id: post.id },
        update: {
          media_id: post.id,
          caption: post.caption,
          media_type: post.media_type,
          media_url: post.media_url,
          thumbnail_url: post.thumbnail_url || null,
          permalink: post.permalink,
          timestamp: new Date(post.timestamp)
        },
        upsert: true
      }
    }));

    await InstagramPost.bulkWrite(bulkOps);

    const paginatedPosts = posts.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      success: true,
      data: paginatedPosts,
      message: 'Fetched from Instagram Graph API'
    });
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const postToInstagram = async (req, res) => {
  try {
    const { image_url, caption } = req.body;

    if (!image_url) {
      return res.status(400).json({ success: false, message: 'Image URL is required' });
    }

    console.log('process.env.INSTAGRAM_ACCESS_TOKEN: ', process.env.INSTAGRAM_ACCESS_TOKEN);
    const mediaResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media`,
      {
        image_url,
        caption,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      }
    );

    const creationId = mediaResponse.data.id;

    const publishResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media_publish`,
      {
        creation_id: creationId,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      }
    );

    res.status(201).json({
      success: true,
      data: publishResponse.data,
      message: 'Post successfully published to Instagram',
    });
  } catch (error) {
    console.error('Error posting to Instagram:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getInstagramFeed,
  postToInstagram
}