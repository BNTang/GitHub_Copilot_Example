/**
 * Utility for fetching and processing GeoJSON data
 */

/**
 * Fetch GeoJSON data from a URL or local cache
 */
function fetchGeoJSON(callback) {
  const fs = wx.getFileSystemManager();
  
  // Try to read from local cache first
  try {
    fs.access({
      path: `${wx.env.USER_DATA_PATH}/china-map.json`,
      success: () => {
        // Cache file exists, read it
        fs.readFile({
          filePath: `${wx.env.USER_DATA_PATH}/china-map.json`,
          encoding: 'utf-8',
          success: (res) => {
            try {
              const data = JSON.parse(res.data);
              callback(null, data);
            } catch (e) {
              fetchFromRemote(callback);
            }
          },
          fail: () => fetchFromRemote(callback)
        });
      },
      fail: () => fetchFromRemote(callback)
    });
  } catch (e) {
    fetchFromRemote(callback);
  }
}

/**
 * Fetch from remote URL and cache it
 */
function fetchFromRemote(callback) {
  wx.request({
    url: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
    success: (res) => {
      if (res.statusCode === 200 && res.data) {
        // Cache the data for future use
        try {
          const fs = wx.getFileSystemManager();
          fs.writeFileSync(
            `${wx.env.USER_DATA_PATH}/china-map.json`,
            JSON.stringify(res.data),
            'utf-8'
          );
        } catch (e) {
          console.error('Failed to cache GeoJSON', e);
        }
        
        callback(null, res.data);
      } else {
        callback(new Error('Failed to fetch GeoJSON data'));
      }
    },
    fail: (err) => {
      callback(err);
    }
  });
}

module.exports = {
  fetchGeoJSON
};
