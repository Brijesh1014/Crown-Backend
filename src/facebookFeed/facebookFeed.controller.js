const axios = require('axios');
const FacebookFeed = require('./facebookFeed.model');

exports.getFacebookFeed = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const pageId = '122148820706293884';
      const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;  
  
      const cachedPosts = await FacebookFeed.find()
        .sort({ created_time: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
  
      if (cachedPosts.length > 0) {
        return res.status(200).json({
          success: true,
          data: cachedPosts,
          message: 'Fetched from local cache',
        });
      }
  
      const response = await axios.get(
        `https://graph.facebook.com/${pageId}/posts?fields=id,message,created_time,permalink_url&access_token=${accessToken}`
      );
  
      const posts = response.data.data;
  
      const bulkOps = posts.map((post) => ({
        updateOne: {
          filter: { post_id: post.id },
          update: {
            post_id: post.id,
            message: post.message,
            created_time: new Date(post.created_time),
            permalink_url: post.permalink_url,
          },
          upsert: true,
        },
      }));
  
      await FacebookFeed.bulkWrite(bulkOps);
  
      const paginatedPosts = posts.slice((page - 1) * limit, page * limit);
  
      res.status(200).json({
        success: true,
        data: paginatedPosts,
        message: 'Fetched from Facebook Graph API',
      });
    } catch (error) {
      console.error('Error fetching Facebook feed:', error.response?.data || error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  exports.postToFacebook = async (req, res) => {
    try {
      const { message } = req.body;  
  
      const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;  
      const pageId = '122148820706293884';  
  
      const response = await axios.post(
        `https://graph.facebook.com/${pageId}/feed`,
        null, {
          params: {
            message: message,
            access_token: pageAccessToken,
          },
        }
      );
  
      res.status(200).json({
        success: true,
        data: response.data,
        message: 'Successfully posted to Facebook!',
      });
    } catch (error) {
      console.error('Error posting to Facebook:', error.response?.data || error.message);
      res.status(500).json({ success: false, message: 'Failed to post to Facebook.' });
    }
  };
