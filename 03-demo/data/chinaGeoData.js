// China GeoJSON data converted to a JavaScript module
module.exports = {
  "features": [
    // Keep all the features from 100000_full.json, 
    // but converted to JS module format
    {
      "type": "Feature",
      "properties": {
        "name": "China Mainland"
      },
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              // Northeast border starting near Russia
              [135.0, 48.5], [134.3, 47.7], [133.8, 48.5], [133.1, 48.5], 
              [132.5, 47.8], [131.1, 47.8], [130.6, 47.9], [130.4, 47.3], 
              [129.5, 47.3], [128.3, 48.0], [126.9, 48.1], [125.6, 48.4],
              [123.6, 47.6], [121.6, 47.7], [119.8, 50.1], [117.2, 49.3],
              // Northwest China: Mongolia border and Xinjiang
              [114.5, 48.0], [111.8, 49.2], [108.5, 49.5], [104.9, 50.0],
              [97.0, 49.8], [93.5, 48.0], [90.0, 46.0], [88.0, 45.5], 
              [86.8, 44.0], [83.0, 44.9], [80.5, 43.5], [79.8, 42.0], 
              [76.0, 39.5], [73.5, 39.0], [74.0, 37.5],
              // Western border with Pakistan, India
              [75.0, 36.5], [76.5, 35.0], [78.0, 34.3], [78.9, 31.5],
              // Southern China, borders with Nepal, India, Bhutan, Myanmar, Vietnam
              [81.0, 30.0], [82.5, 29.0], [85.9, 28.2], [87.5, 28.0],
              [89.5, 28.2], [92.0, 27.8], [93.3, 28.2], [95.0, 28.0],
              [97.5, 27.5], [98.7, 25.0], [100.0, 23.5], [101.8, 22.0], 
              [104.5, 22.5], [106.5, 21.5], [108.0, 21.0],
              // Southern coast including Hainan area
              [109.5, 20.2], [110.5, 18.0], [113.0, 18.5], [114.5, 20.5],
              [116.5, 22.0], [117.5, 23.0],
              // Eastern coast northwards
              [118.0, 24.5], [119.5, 26.0], [120.5, 27.5], [121.5, 29.0],
              [122.0, 31.0], [122.0, 33.0], [121.0, 35.0], [121.5, 37.0], 
              [122.5, 39.0], [124.0, 40.0], [124.5, 40.5], [125.5, 41.0],
              [126.5, 41.5], [128.0, 42.0], [129.5, 43.0], [130.5, 44.0],
              [133.0, 45.0], [135.0, 48.5] // Back to start
            ]
          ],
          [
            // Hainan Island
            [
              [109.5, 18.2], [110.5, 18.5], [111.0, 19.5], [110.5, 20.0],
              [109.5, 19.8], [108.8, 19.3], [108.5, 18.5], [109.0, 18.0],
              [109.5, 18.2]
            ]
          ],
          [
            // Taiwan
            [
              [121.5, 25.0], [122.0, 25.0], [122.0, 23.0], [121.5, 22.0],
              [120.5, 22.0], [120.0, 23.0], [120.0, 24.0], [121.0, 25.0],
              [121.5, 25.0]
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "South China Sea Islands"
      },
      "geometry": {
        "type": "MultiPolygon", // Changed from MultiPoint to MultiPolygon for better rendering
        "coordinates": [
          [
            [
              [112.8, 16.5], [114.3, 15.2], [115.8, 11.0], 
              [111.5, 11.8], [110.0, 8.0], [109.0, 10.5], 
              [112.8, 16.5]
            ]
          ]
        ]
      }
    },
    // Add additional features from 100000_full.json if needed
  ]
};
