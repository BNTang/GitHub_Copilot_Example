<template>
	<view class="container">
		<map id="map" 
			class="map"
			:latitude="latitude" 
			:longitude="longitude" 
			:scale="scale"
			:polyline="boundaries"
			:include-points="includePoints"
			:show-compass="false"
			:enable-poi="false"
			:enable-building="false"
			:enable-3D="false"
			:enable-overlooking="false"
			:enable-rotate="false"
			:rotate="0"
			:skew="0"
			:enable-satellite="false"
			:enable-traffic="false"
			@updated="onMapUpdated">
		</map>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				latitude: 35.6,
				longitude: 104.5,
				scale: 4,
				boundaries: [{
					points: [],
					color: '#4db8ff',
					width: 2,
					dottedLine: false
				}],
				includePoints: [
					{ latitude: 18, longitude: 73 },  // Southwest corner
					{ latitude: 54, longitude: 135 }  // Northeast corner
				],
				mapContext: null,
				mapLoaded: false
			}
		},
		onLoad() {
			this.loadBoundaries();
		},
		onReady() {
			this.mapContext = uni.createMapContext('map', this);
		},
		methods: {
			onMapUpdated(e) {
				if (!this.mapLoaded) {
					this.mapLoaded = true;
					console.log('Map updated and ready');
				}
			},
			loadBoundaries() {
				// Use map's built-in boundary display
				// The map will automatically display regional boundaries
				// No need to manually draw polylines or fetch data
				
				// If in the future you want to customize the boundaries:
				// 1. You could fetch boundary data from a service
				// 2. Or integrate it from a local file
				console.log('Map set to display boundaries only');
			}
		}
	}
</script>

<style>
	.container {
		width: 100%;
		height: 100vh;
		position: relative;
	}
	
	.map {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 23, 51, 0.7);  /* Dark blue background with transparency */
	}
</style>
