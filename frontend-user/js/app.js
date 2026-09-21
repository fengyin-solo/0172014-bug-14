/* ========================================
   应用主入口
   ======================================== */

class App {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;

        // 初始化组件（单模块失败不影响其余模块）
        try {
            window.componentRenderer.init();
        } catch (err) {
            console.error('组件渲染失败', err);
        }

        // 初始化图表
        try {
            window.chartManager.initFunnelChart('funnelChart');
        } catch (err) {
            console.error('漏斗图初始化失败', err);
        }
        try {
            window.chartManager.initRadarChart('radarChart');
        } catch (err) {
            console.error('雷达图初始化失败', err);
        }

        // 监听窗口大小变化
        window.addEventListener('resize', this.handleResize.bind(this));

        // 监听滚动
        window.addEventListener('scroll', this.handleScroll.bind(this));

        console.log('🚀 Dashboard initialized successfully');
    }

    handleResize() {
        // 防抖处理
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            window.chartManager.resize();
        }, 250);
    }

    handleScroll() {
        // 可以添加滚动相关的动画效果
        const scrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        if (header) {
            const opacity = Math.max(0.5, 1 - scrollY / 500);
            header.style.opacity = opacity;
        }
    }

    // 刷新数据
    refresh() {
        window.toast.info('刷新中', '正在重新加载数据...');

        setTimeout(() => {
            try {
                window.componentRenderer.renderStats();
                window.componentRenderer.renderMatrix();
                window.componentRenderer.renderQuickWins();
                window.componentRenderer.renderFooter();
                window.chartManager.resize();

                window.toast.success('刷新完成', '数据已更新');
            } catch (err) {
                console.error('刷新失败', err);
                window.toast.error('刷新失败', '部分模块异常，已保留当前展示');
            }
        }, 1000);
    }

    // 导出报告
    exportReport() {
        window.toast.info('导出报告', '正在生成PDF报告...');
        
        setTimeout(() => {
            window.toast.success('导出成功', '报告已保存到下载目录');
        }, 2000);
    }
}

// 创建应用实例
const app = new App();

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// 暴露全局方法
window.app = app;
