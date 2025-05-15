// 侧边栏切换
let btn = document.querySelector("#btn");
let sidebar = document.querySelector(".sidebar");

btn.onclick = function() {
    sidebar.classList.toggle("active");
}

// 数字计数动画
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.innerText.replace(/,/g, ''));
        const duration = 1500;
        const step = 30;
        const steps = duration / step;
        const increment = target / steps;
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.floor(current).toLocaleString();
                setTimeout(updateCounter, step);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
    
    // 初始化ECharts图表
    initChart();
});

// 初始化图表
function initChart() {
    const chartDom = document.getElementById('main-chart');
    const myChart = echarts.init(chartDom);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['2025-05-08', '2025-05-09', '2025-05-10', '2025-05-11', '2025-05-12', '2025-05-13', '2025-05-14'],
            axisLabel: {
                interval: 0,
                rotate: 30
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '拉取量',
                type: 'line',
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: '#4361ee'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(67, 97, 238, 0.3)'
                        }, {
                            offset: 1, color: 'rgba(67, 97, 238, 0.05)'
                        }]
                    }
                },
                data: [770, 1762, 1957, 1390, 1389, 735, 181],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };
    
    myChart.setOption(option);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        myChart.resize();
    });
    
    // 数据选择器变化时更新图表
    document.querySelector('.form-select').addEventListener('change', function() {
        const selectedMetric = this.value;
        let newData = [];
        let color = '#4361ee';
        
        switch(selectedMetric) {
            case '拉取量':
                newData = [770, 1762, 1957, 1390, 1389, 735, 181];
                color = '#4361ee';
                break;
            case '曝光量':
                newData = [261, 626, 931, 703, 621, 303, 46];
                color = '#38b2ac';
                break;
            case '曝光率 (%)':
                newData = [33.90, 35.53, 47.57, 50.58, 44.71, 41.22, 25.41];
                color = '#805ad5';
                break;
            case '点击量':
                newData = [0, 0, 1, 3, 0, 1, 0];
                color = '#dd6b20';
                break;
            case '点击率 (%)':
                newData = [0, 0, 0.11, 0.43, 0, 0.33, 0];
                color = '#e53e3e';
                break;
            case 'eCPM (元)':
                newData = [2.41, 1.82, 1.99, 3.13, 1.87, 2.41, 3.04];
                color = '#d69e2e';
                break;
            case '收入 (元)':
                newData = [0.63, 1.14, 1.85, 2.20, 1.16, 0.73, 0.14];
                color = '#38b2ac';
                break;
        }
        
        option.series[0].name = selectedMetric;
        option.series[0].data = newData;
        option.series[0].lineStyle.color = color;
        option.series[0].areaStyle.color.colorStops[0].color = `rgba(${hexToRgb(color)}, 0.3)`;
        option.series[0].areaStyle.color.colorStops[1].color = `rgba(${hexToRgb(color)}, 0.05)`;
        
        myChart.setOption(option);
    });
}

// Hex颜色转RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return `${r}, ${g}, ${b}`;
}