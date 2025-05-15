Page({
  data: {
    latitude: 35.6, // China's center latitude
    longitude: 104.5, // China's center longitude
    scale: 4, // Zoom level suitable for showing all of China
    geoJsonData: null,
    stars: [],
    setting: {
      skew: 0,
      rotate: 0,
      showLocation: false,
      showScale: false,
      subKey: '',
      layerStyle: 2, // Dark style map (night mode)
      enableZoom: true,
      enableScroll: true,
      enableRotate: false,
      showCompass: false,
      enable3D: false,
      enableOverlooking: false,
      enableSatellite: false,
      enableTraffic: false
    },
    canvasWidth: 0,
    canvasHeight: 0,
    transform: {
      scale: 1,
      offsetX: 0,
      offsetY: 0
    },
    gesture: {
      startDistance: 0,
      startScale: 1,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      moving: false
    },
    isLoading: true // Add loading state indicator
  },
  
  onLoad: function() {
    // Get system info for sizing
    const sysInfo = wx.getSystemInfoSync();
    this.setData({
      canvasWidth: sysInfo.windowWidth,
      canvasHeight: sysInfo.windowHeight
    });
    
    // Generate random stars (glowing dots)
    this.generateStars();
    
    // Load local data first to ensure quick rendering
    const localChinaData = require('../../data/china-simplified.js');
    // Process the local data immediately
    this.processGeoJsonData(localChinaData);
    
    // Set loading to false since we already have local data
    this.setData({
      isLoading: false
    });
    
    // Optionally try to fetch newer data from API (but don't depend on it)
    this.tryFetchRemoteData();
  },

  // New method to attempt fetching remote data without blocking the UI
  tryFetchRemoteData: function() {
    console.log('尝试获取远程地图数据...');
    
    // 在微信小程序中不能设置User-Agent请求头
    wx.request({
      url: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        // 移除不安全的User-Agent头
        'Referer': 'https://datav.aliyun.com/'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          console.log('成功从网络加载地图数据');
          // Process the GeoJSON data
          this.processGeoJsonData(res.data);
          
          wx.showToast({
            title: '地图数据已更新',
            icon: 'success',
            duration: 2000
          });
        } else {
          console.error('获取地图数据失败:', res);
          // No need to show error toast since we're already using local data
        }
      },
      fail: (err) => {
        console.error('获取地图数据错误:', err);
        
        // 403错误是由于阿里云API限制引起的，属于正常情况
        if (err.statusCode === 403) {
          console.log('地图API拒绝访问(403)，使用本地数据');
        }
      }
    });
    
    // 设置超时，在一段时间后检查是否已有数据
    setTimeout(() => {
      if (!this.data.geoJsonData) {
        console.log('地图数据加载超时，使用本地数据');
        const localChinaData = require('../../data/china-simplified.js');
        this.processGeoJsonData(localChinaData);
      }
    }, 5000); // 5秒超时
  },

  handleTouchStart: function(e) {
    if (e.touches.length === 2) {
      // Two fingers - zoom gesture
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      this.setData({
        'gesture.startDistance': distance,
        'gesture.startScale': this.data.transform.scale,
        'gesture.moving': true
      });
    } else if (e.touches.length === 1) {
      // One finger - pan gesture
      const touch = e.touches[0];
      this.setData({
        'gesture.startX': touch.clientX,
        'gesture.startY': touch.clientY,
        'gesture.lastX': this.data.transform.offsetX,
        'gesture.lastY': this.data.transform.offsetY,
        'gesture.moving': true
      });
    }
  },
  
  handleTouchMove: function(e) {
    if (!this.data.gesture.moving) return;
    
    if (e.touches.length === 2) {
      // Handle zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      // Calculate new scale
      let newScale = this.data.gesture.startScale * (distance / this.data.gesture.startDistance);
      
      // Clamp scale to reasonable values
      newScale = Math.max(0.5, Math.min(3, newScale));
      
      this.setData({
        'transform.scale': newScale
      });
      
      this.drawGlowEffect();
    } else if (e.touches.length === 1) {
      // Handle pan
      const touch = e.touches[0];
      const offsetX = this.data.gesture.lastX + (touch.clientX - this.data.gesture.startX);
      const offsetY = this.data.gesture.lastY + (touch.clientY - this.data.gesture.startY);
      
      this.setData({
        'transform.offsetX': offsetX,
        'transform.offsetY': offsetY
      });
      
      this.drawGlowEffect();
    }
  },
  
  handleTouchEnd: function() {
    this.setData({
      'gesture.moving': false
    });
  },
  
  zoomIn: function() {
    let newScale = this.data.transform.scale * 1.2;
    newScale = Math.min(3, newScale);
    this.setData({
      'transform.scale': newScale
    });
    this.drawGlowEffect();
  },
  
  zoomOut: function() {
    let newScale = this.data.transform.scale / 1.2;
    newScale = Math.max(0.5, newScale);
    this.setData({
      'transform.scale': newScale
    });
    this.drawGlowEffect();
  },
  
  processGeoJsonData: function(geoJson) {
    if (!geoJson || !geoJson.features || !Array.isArray(geoJson.features)) {
      console.error('Invalid GeoJSON data structure');
      return;
    }
    
    // Create a combined geometry for all provinces/regions
    const combinedGeometry = {
      type: 'MultiPolygon',
      coordinates: []
    };
    
    // Process each feature (province/region)
    geoJson.features.forEach(feature => {
      if (feature.geometry) {
        if (feature.geometry.type === 'Polygon') {
          // Add polygon coordinates to our multi-polygon
          combinedGeometry.coordinates.push(feature.geometry.coordinates);
        } else if (feature.geometry.type === 'MultiPolygon') {
          // Add all polygons from multi-polygon
          combinedGeometry.coordinates = combinedGeometry.coordinates.concat(feature.geometry.coordinates);
        }
      }
    });
    
    // Store the processed data
    this.setData({
      geoJsonData: combinedGeometry
    }, () => {
      // Draw the effect after data is processed
      this.drawGlowEffect();
    });
  },
  
  generateStars: function() {
    // Generate random stars (glowing dots) similar to the PC version
    const stars = [];
    for (let i = 0; i < 100; i++) {
      // Generate points within China's approximate bounds
      const lng = 73 + Math.random() * 62; // 73-135 longitude range for China
      const lat = 18 + Math.random() * 36; // 18-54 latitude range for China
      
      stars.push({
        longitude: lng,
        latitude: lat,
        brightness: 0.3 + Math.random() * 0.7,
        size: 0.5 + Math.random() * 1.5
      });
    }
    
    this.setData({ stars });
  },
  
  drawGlowEffect: function() {
    try {
      const query = wx.createSelectorQuery();
      query.select('#glowCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          try {
            if (!res || !res[0] || !res[0].node) {
              console.error('Canvas node not found');
              return;
            }
            
            const canvas = res[0].node;
            if (!canvas) {
              console.error('Canvas is undefined');
              return;
            }
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              console.error('Canvas context is undefined');
              return;
            }
            
            // Set canvas dimensions
            canvas.width = this.data.canvasWidth;
            canvas.height = this.data.canvasHeight;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw China borders if we have the data
            if (this.data.geoJsonData) {
              this.drawChinaBorders(ctx, canvas);
            }
            
            // Draw the star effects
            this.drawStars(ctx, canvas);
            
            // Set up animation loop
            this.setupAnimationLoop(ctx, canvas);
          } catch (innerError) {
            console.error('Error during canvas rendering:', innerError);
          }
        });
    } catch (outerError) {
      console.error('Error in drawGlowEffect:', outerError);
    }
  },
  
  drawChinaBorders: function(ctx, canvas) {
    if (!this.data.geoJsonData) {
      console.error('No GeoJSON data available');
      return;
    }
    
    // Get rough pixel conversion for the map coordinates
    // Adjust map bounds based on the actual boundaries in the new GeoJSON data
    const padding = 45; // Increased padding for better visual appearance
    const minLong = 73;    // Approximate westernmost longitude of China
    const maxLong = 135;   // Approximate easternmost longitude of China
    const minLat = 3.5;    // Adjusted to include South China Sea islands
    const maxLat = 53.5;   // Approximate northernmost latitude of China
    
    // Calculate available canvas space
    const canvasWidth = canvas.width - (2 * padding);
    const canvasHeight = canvas.height - (2 * padding);
    
    try {
      // Adjust map scaling to fit the new data properly
      // Make mainland China occupy most of the view space
      const mainlandScaleFactor = 0.9;
      const mainlandOffsetY = -canvasHeight * 0.05; // Move the mainland up slightly
      
      // Draw each polygon in the MultiPolygon with multiple glow layers
      const multiPolygon = this.data.geoJsonData.coordinates;
      
      if (!Array.isArray(multiPolygon) || multiPolygon.length === 0) {
        console.error('Invalid MultiPolygon structure');
        return;
      }
      
      // Draw background glow (extra large blur for ambient effect)
      this.drawGlowLayer(ctx, multiPolygon, {
        lineWidth: 6,
        strokeStyle: '#0066aa',
        shadowBlur: 20,
        shadowColor: '#0066aa',
        opacity: 0.2,
        padding, minLong, maxLong, minLat, maxLat, 
        canvasWidth, canvasHeight,
        scaleFactor: mainlandScaleFactor,
        offsetY: mainlandOffsetY
      });
      
      // Outer glow (thicker, more blurred)
      this.drawGlowLayer(ctx, multiPolygon, {
        lineWidth: 4,
        strokeStyle: '#0099ff',
        shadowBlur: 15,
        shadowColor: '#0099ff',
        opacity: 0.4,
        padding, minLong, maxLong, minLat, maxLat, 
        canvasWidth, canvasHeight,
        scaleFactor: mainlandScaleFactor,
        offsetY: mainlandOffsetY
      });
      
      // Middle glow layer
      this.drawGlowLayer(ctx, multiPolygon, {
        lineWidth: 2,
        strokeStyle: '#0099ff',
        shadowBlur: 8,
        shadowColor: '#0099ff',
        opacity: 0.7,
        padding, minLong, maxLong, minLat, maxLat, 
        canvasWidth, canvasHeight,
        scaleFactor: mainlandScaleFactor,
        offsetY: mainlandOffsetY
      });
      
      // Inner glow (thin, sharp)
      this.drawGlowLayer(ctx, multiPolygon, {
        lineWidth: 1,
        strokeStyle: '#4db8ff',
        shadowBlur: 3,
        shadowColor: '#4db8ff',
        opacity: 1.0,
        padding, minLong, maxLong, minLat, maxLat, 
        canvasWidth, canvasHeight,
        scaleFactor: mainlandScaleFactor,
        offsetY: mainlandOffsetY
      });
    } catch (error) {
      console.error('Error drawing China borders:', error);
    }
  },
  
  drawGlowLayer: function(ctx, multiPolygon, options) {
    const {
      lineWidth, strokeStyle, shadowBlur, shadowColor, opacity,
      padding, minLong, maxLong, minLat, maxLat, canvasWidth, canvasHeight,
      scaleFactor = 1, offsetY = 0
    } = options;
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
    
    // Apply scale and offset transformations
    const transform = this.data.transform;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    
    ctx.translate(centerX + transform.offsetX, centerY + transform.offsetY);
    ctx.scale(transform.scale, transform.scale);
    ctx.translate(-centerX, -centerY);
    
    // Function to map geo coordinates to canvas pixels with additional scaling
    const mapToPixel = (lng, lat) => {
      const x = ((lng - minLong) / (maxLong - minLong)) * canvasWidth * scaleFactor + padding;
      const y = canvasHeight - ((lat - minLat) / (maxLat - minLat)) * canvasHeight * scaleFactor + padding + offsetY;
      return { x, y };
    };
    
    // Draw each polygon
    multiPolygon.forEach(polygon => {
      // Each polygon can have multiple rings (outer ring and holes)
      polygon.forEach(ring => {
        if (ring && ring.length > 0) {
          ctx.beginPath();
          
          // First point
          const firstPoint = mapToPixel(ring[0][0], ring[0][1]);
          ctx.moveTo(firstPoint.x, firstPoint.y);
          
          // Remaining points
          for (let i = 1; i < ring.length; i++) {
            const point = mapToPixel(ring[i][0], ring[i][1]);
            ctx.lineTo(point.x, point.y);
          }
          
          ctx.closePath();
          ctx.stroke();
        }
      });
    });
    
    ctx.restore();
  },
  
  drawStars: function(ctx, canvas) {
    ctx.save();
    
    // Apply scale and offset transformations for stars
    const transform = this.data.transform;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.translate(centerX + transform.offsetX, centerY + transform.offsetY);
    ctx.scale(transform.scale, transform.scale);
    ctx.translate(-centerX, -centerY);
    
    // Draw each star - adjust parameters to match the new map bounds
    const padding = 45;
    const minLong = 73;
    const maxLong = 135;
    const minLat = 3.5;
    const maxLat = 53.5;
    
    // Scale factor to match the map adjustment
    const scaleFactor = 0.9; 
    const offsetY = -canvas.height * 0.05;
    
    this.data.stars.forEach(star => {
      const canvasWidth = canvas.width - (2 * padding);
      const canvasHeight = canvas.height - (2 * padding);
      
      // Calculate position with the same adjustments as the map
      const x = ((star.longitude - minLong) / (maxLong - minLong)) * canvasWidth * scaleFactor + padding;
      const y = canvasHeight - ((star.latitude - minLat) / (maxLat - minLat)) * canvasHeight * scaleFactor + padding + offsetY;
      
      // Draw the star
      ctx.beginPath();
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(77, 184, 255, ${star.brightness})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#4db8ff';
      ctx.fill();
    });
    
    ctx.restore();
  },
  
  setupAnimationLoop: function(ctx, canvas) {
    // Animate stars by periodically regenerating them
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }
    
    this.animationTimer = setInterval(() => {
      // Generate new stars
      this.generateStars();
      
      // Redraw the canvas
      this.drawGlowEffect();
    }, 3000);  // Update every 3 seconds for subtle animation
  },
  
  onReady: function() {
    // Draw when ready
    setTimeout(() => {
      this.drawGlowEffect();
    }, 500);
  },
  
  onShow: function() {
    // Redraw when showing the page
    setTimeout(() => {
      this.drawGlowEffect();
    }, 500);
  },
  
  onHide: function() {
    // Clear animation when hiding
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }
  },
  
  onUnload: function() {
    // Clear animation when unloading
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }
  },
  
  // Navigate back to index page
  goBack: function() {
    wx.navigateBack();
  }
});
