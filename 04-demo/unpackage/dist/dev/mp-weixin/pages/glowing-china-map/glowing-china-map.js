"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      latitude: 35.6,
      longitude: 104.5,
      scale: 4,
      boundaries: [{
        points: [],
        color: "#4db8ff",
        width: 2,
        dottedLine: false
      }],
      includePoints: [
        { latitude: 18, longitude: 73 },
        // Southwest corner
        { latitude: 54, longitude: 135 }
        // Northeast corner
      ],
      mapContext: null,
      mapLoaded: false
    };
  },
  onLoad() {
    this.loadBoundaries();
  },
  onReady() {
    this.mapContext = common_vendor.index.createMapContext("map", this);
  },
  methods: {
    onMapUpdated(e) {
      if (!this.mapLoaded) {
        this.mapLoaded = true;
        common_vendor.index.__f__("log", "at pages/glowing-china-map/glowing-china-map.vue:51", "Map updated and ready");
      }
    },
    loadBoundaries() {
      common_vendor.index.__f__("log", "at pages/glowing-china-map/glowing-china-map.vue:62", "Map set to display boundaries only");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.latitude,
    b: $data.longitude,
    c: $data.scale,
    d: $data.boundaries,
    e: $data.includePoints,
    f: common_vendor.o((...args) => $options.onMapUpdated && $options.onMapUpdated(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/glowing-china-map/glowing-china-map.js.map
