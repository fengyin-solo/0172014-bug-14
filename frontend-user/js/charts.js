/* ========================================
   图表组件
   ======================================== */

class ChartManager {
    constructor() {
        this.charts = {};
    }

    // 初始化漏斗图
    initFunnelChart(containerId, data = window.dashboardData) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        if (!window.echarts) {
            container.innerHTML = '<div class="chart-fallback">漏斗图图表库未加载；当前数据面板仍可正常查看，图表数据待网络恢复后重绘。</div>';
            return null;
        }
        const funnel = Array.isArray(data?.funnel) && data.funnel.length > 0
            ? data.funnel
            : window.dashboardData.funnel;

        if (this.charts.funnel) {
            this.charts.funnel.dispose();
        }

        const chart = echarts.init(container);
        this.charts.funnel = chart;

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: params => `${params.name}: ${params.data.displayValue}`,
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
                    formatter: params => `${params.name}\n${params.data.displayValue}`,
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
                data: funnel.map(item => ({
                    value: item.value,
                    displayValue: item.displayValue || `${item.value}%`,
                    name: item.name,
                    itemStyle: { color: item.color }
                }))
            }]
        };

        chart.setOption(option, true);
        
        // 点击事件
        chart.on('click', (params) => {
            window.toast?.info('漏斗分析', `${params.name}: 转化率 ${params.data.displayValue}`);
        });

        return chart;
    }

    // 初始化雷达图
    initRadarChart(containerId, data = window.dashboardData) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        if (!window.echarts) {
            container.innerHTML = '<div class="chart-fallback">雷达图图表库未加载；当前数据面板仍可正常查看，图表数据待网络恢复后重绘。</div>';
            return null;
        }
        const radar = data?.radar && Array.isArray(data.radar.indicators)
            ? data.radar
            : window.dashboardData.radar;

        if (this.charts.radar) {
            this.charts.radar.dispose();
        }

        const chart = echarts.init(container);
        this.charts.radar = chart;

        const option = {
            backgroundColor: 'transparent',
            legend: {
                data: radar.series.map(s => s.name),
                bottom: 0,
                textStyle: { color: '#94a3b8', fontSize: 12 },
                itemWidth: 16,
                itemHeight: 10,
                itemGap: 20
            },
            tooltip: {
                trigger: 'item',
                formatter: params => {
                    const series = radar.series[params.seriesIndex];
                    const rows = radar.indicators.map((indicator, index) => {
                        const value = series?.displayValues?.[index] ?? '--';
                        return `${indicator.name}: ${value}`;
                    }).join('<br>');
                    return `<strong>${params.name}</strong><br>${rows}`;
                },
                backgroundColor: 'rgba(20, 20, 35, 0.95)',
                borderColor: 'rgba(168, 85, 247, 0.3)',
                borderWidth: 1,
                textStyle: { color: '#f8fafc' },
                extraCssText: 'backdrop-filter: blur(10px); border-radius: 8px;'
            },
            radar: {
                indicator: radar.indicators,
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
                data: radar.series.map(s => ({
                    value: s.value,
                    displayValues: s.displayValues,
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

        chart.setOption(option, true);

        // 点击事件
        chart.on('click', (params) => {
            if (params.name) {
                window.toast?.info('能力对比', `${params.seriesName}: ${params.name}`);
            }
        });

        return chart;
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
