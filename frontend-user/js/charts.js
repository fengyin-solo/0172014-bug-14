/* ========================================
   图表组件
   ======================================== */

class ChartManager {
    constructor() {
        this.charts = {};
    }

    // 数值安全转换，杜绝 NaN 进入图表
    safeValue(value) {
        return window.dataSanitizer ? window.dataSanitizer.toSafeNumber(value, 0) : (Number(value) || 0);
    }

    // 图表不可用时的可读占位
    renderChartFallback(container, message) {
        container.innerHTML = `<div class="chart-fallback">⚠️ ${message}，其余模块不受影响</div>`;
    }

    // 初始化漏斗图
    initFunnelChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (typeof echarts === 'undefined') {
            this.renderChartFallback(container, '图表组件加载失败');
            return;
        }

        const data = (typeof funnelData !== 'undefined' && Array.isArray(funnelData)) ? funnelData : [];
        if (!data.length) {
            this.renderChartFallback(container, '漏斗数据缺失');
            return;
        }

        try {
            const chart = echarts.init(container);
            this.charts.funnel = chart;

            const option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}%',
                    backgroundColor: 'rgba(20, 20, 35, 0.95)',
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                    borderWidth: 1,
                    textStyle: { color: '#f8fafc' },
                    extraCssText: 'backdrop-filter: blur(10px); border-radius: 8px;'
                },
                series: [{
                    type: 'funnel',
                    left: '10%',
                    right: '10%',
                    top: '8%',
                    bottom: '8%',
                    width: '80%',
                    min: 0,
                    max: 100,
                    minSize: '0%',
                    maxSize: '100%',
                    sort: 'descending',
                    gap: 3,
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{b}\n{c}%',
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 600,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    },
                    labelLine: { show: false },
                    itemStyle: {
                        borderColor: 'rgba(168, 85, 247, 0.5)',
                        borderWidth: 2,
                        shadowBlur: 20,
                        shadowColor: 'rgba(168, 85, 247, 0.3)'
                    },
                    emphasis: {
                        label: { fontSize: 15 },
                        itemStyle: {
                            shadowBlur: 30,
                            shadowColor: 'rgba(168, 85, 247, 0.5)'
                        }
                    },
                    data: data.map(item => ({
                        value: this.safeValue(item.value),
                        name: item.name,
                        itemStyle: { color: item.color }
                    }))
                }]
            };

            chart.setOption(option);

            // 点击事件
            chart.on('click', (params) => {
                window.toast.info('漏斗分析', `${params.name}: 转化率 ${params.value}%`);
            });

            return chart;
        } catch (err) {
            console.error('漏斗图渲染失败', err);
            this.renderChartFallback(container, '漏斗图渲染异常');
        }
    }

    // 初始化雷达图
    initRadarChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (typeof echarts === 'undefined') {
            this.renderChartFallback(container, '图表组件加载失败');
            return;
        }

        const data = (typeof radarData !== 'undefined' && radarData && typeof radarData === 'object') ? radarData : null;
        const indicators = data && Array.isArray(data.indicators) ? data.indicators : [];
        const series = data && Array.isArray(data.series) ? data.series : [];
        if (!indicators.length || !series.length) {
            this.renderChartFallback(container, '雷达图数据缺失');
            return;
        }

        try {
            const chart = echarts.init(container);
            this.charts.radar = chart;

            const option = {
                backgroundColor: 'transparent',
                legend: {
                    data: series.map(s => s.name),
                    bottom: 0,
                    textStyle: { color: '#94a3b8', fontSize: 12 },
                    itemWidth: 16,
                    itemHeight: 10,
                    itemGap: 20
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(20, 20, 35, 0.95)',
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                    borderWidth: 1,
                    textStyle: { color: '#f8fafc' },
                    extraCssText: 'backdrop-filter: blur(10px); border-radius: 8px;'
                },
                radar: {
                    indicator: indicators,
                    shape: 'polygon',
                    splitNumber: 4,
                    center: ['50%', '48%'],
                    radius: '65%',
                    axisName: {
                        color: '#94a3b8',
                        fontSize: 12,
                        fontWeight: 500
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(168, 85, 247, 0.15)',
                            width: 1
                        }
                    },
                    splitArea: {
                        areaStyle: {
                            color: ['rgba(168, 85, 247, 0.02)', 'rgba(168, 85, 247, 0.06)']
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(168, 85, 247, 0.2)'
                        }
                    }
                },
                series: [{
                    type: 'radar',
                    data: series.map(s => ({
                        value: (Array.isArray(s.value) ? s.value : []).map(v => this.safeValue(v)),
                        name: s.name,
                        symbol: 'circle',
                        symbolSize: 8,
                        lineStyle: {
                            color: s.color,
                            width: 2,
                            shadowBlur: 10,
                            shadowColor: s.color
                        },
                        areaStyle: { color: s.areaColor },
                        itemStyle: {
                            color: s.color,
                            borderColor: '#fff',
                            borderWidth: 2
                        }
                    }))
                }]
            };

            chart.setOption(option);

            // 点击事件
            chart.on('click', (params) => {
                if (params.name) {
                    window.toast.info('能力对比', `${params.seriesName}: ${params.name}`);
                }
            });

            return chart;
        } catch (err) {
            console.error('雷达图渲染失败', err);
            this.renderChartFallback(container, '雷达图渲染异常');
        }
    }

    // 响应式调整
    resize() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }

    // 销毁图表
    dispose() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.dispose) {
                chart.dispose();
            }
        });
        this.charts = {};
    }
}

// 创建全局实例
window.chartManager = new ChartManager();
