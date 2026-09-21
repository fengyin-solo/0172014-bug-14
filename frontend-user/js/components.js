/* ========================================
   UI 组件渲染
   ======================================== */

class ComponentRenderer {
    constructor() {
        this.typewriterText = '基于2026年"拉新"战略核心，诊断当前会员体系成熟度，识别关键断层，规划升级路径...';
        this.charIndex = 0;
    }

    // 打字机效果
    startTypewriter() {
        const el = document.getElementById('typewriter');
        if (!el) return;

        const type = () => {
            if (this.charIndex < this.typewriterText.length) {
                el.textContent = this.typewriterText.substring(0, this.charIndex + 1);
                this.charIndex++;
                setTimeout(type, 45);
            }
        };
        type();
    }

    // 渲染统计卡片
    renderStats() {
        const container = document.getElementById('statsGrid');
        if (!container) return;

        const list = (typeof statsData !== 'undefined' && Array.isArray(statsData)) ? statsData : [];
        if (!list.length) {
            container.innerHTML = '<div class="glass-card stat-card"><div class="stat-label">⚠️ 统计数据缺失</div></div>';
            return;
        }

        container.innerHTML = list.map((stat, index) => `
            <div class="glass-card stat-card fade-in delay-${index + 1}" data-index="${index}">
                <span class="stat-icon">${stat.icon}</span>
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
                ${stat.trend ? `<div class="stat-trend">${stat.trend}</div>` : ''}
            </div>
        `).join('');

        // 添加点击事件
        container.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', () => {
                const index = card.dataset.index;
                const stat = list[index];
                if (stat) {
                    window.toast.info(stat.label, `当前值: ${stat.value}`);
                }
            });
        });
    }

    // 渲染矩阵表格
    renderMatrix() {
        const table = document.getElementById('matrixTable');
        if (!table) return;

        try {
            const dims = (typeof matrixData !== 'undefined' && Array.isArray(matrixData.dimensions)) ? matrixData.dimensions : [];
            const phases = (typeof matrixData !== 'undefined' && Array.isArray(matrixData.phases)) ? matrixData.phases : [];
            const cells = (typeof matrixData !== 'undefined' && matrixData.cells && typeof matrixData.cells === 'object') ? matrixData.cells : {};

            if (!dims.length || !phases.length) {
                table.innerHTML = '<tbody><tr><td class="matrix-empty">⚠️ 矩阵数据缺失，请检查数据源后刷新</td></tr></tbody>';
                return;
            }

            let html = '<thead><tr><th>运营维度</th>';

            phases.forEach(p => {
                html += `
                    <th>
                        <div style="font-weight: 700;">${p.name}</div>
                        <div style="font-size: 12px; color: var(--neon-cyan); margin-top: 6px; opacity: 0.9;">
                            焦点: ${p.subtitle}
                        </div>
                    </th>
                `;
            });
            html += '</tr></thead><tbody>';

            dims.forEach((dim, dimIndex) => {
                html += `<tr class="fade-in delay-${Math.min(dimIndex + 1, 5)}">`;
                html += `
                    <td class="dimension-cell">
                        <span class="dimension-icon">${dim.icon}</span>
                        ${dim.name}
                    </td>
                `;

                phases.forEach(phase => {
                    const row = cells[dim.key] && typeof cells[dim.key] === 'object' ? cells[dim.key] : {};
                    html += this.buildMatrixCell(row[phase.key]);
                });
                html += '</tr>';
            });

            html += '</tbody>';
            table.innerHTML = html;

            // 添加工具标签点击事件
            table.querySelectorAll('.tool-tag:not(.placeholder)').forEach(tag => {
                tag.addEventListener('click', () => {
                    const toolName = tag.dataset.tool;
                    const isInternational = tag.classList.contains('international');
                    window.toast.info(
                        '工具推荐',
                        `${toolName} - ${isInternational ? '国际工具' : '国内工具'}`,
                        3000
                    );
                });
            });
        } catch (err) {
            console.error('矩阵渲染失败', err);
            table.innerHTML = '<tbody><tr><td class="matrix-empty">⚠️ 矩阵渲染异常，其余模块不受影响，请刷新重试</td></tr></tbody>';
        }
    }

    // 构建单个矩阵单元格（缺失数据给出兜底，绝不渲染成空白）
    buildMatrixCell(cell) {
        if (!cell || typeof cell !== 'object') {
            return `<td class="cell-fallback"><div class="cell-content">
                <span class="status-tag tag-fallback">⚠️ 数据缺失 · 暂按阶段1档（起步）处理</span>
                <div class="sop-list"><div class="sop-item">数据待补充</div></div>
                <div class="tools-section"><div class="tools-label">🔧 推荐工具</div><span class="tool-tag placeholder">待补充</span></div>
            </div></td>`;
        }

        let cellClass = '';
        let tag = '';

        if (cell.fallback) {
            cellClass = 'cell-fallback';
            tag = `<span class="status-tag tag-fallback">⚠️ 数据缺失 · 暂按${cell.assumedTier || '阶段1档（起步）'}处理</span>`;
        } else if (cell.current) {
            cellClass = 'cell-current';
            tag = '<span class="status-tag tag-current">📍 当前位置</span>';
        } else if (cell.target) {
            cellClass = 'cell-target';
            tag = '<span class="status-tag tag-target">🎯 改进目标</span>';
        }

        const sopList = (Array.isArray(cell.sop) && cell.sop.length) ? cell.sop : ['数据待补充'];
        const tools = (cell.tools && typeof cell.tools === 'object') ? cell.tools : {};
        const intlTools = Array.isArray(tools.international) ? tools.international : [];
        const domesticTools = Array.isArray(tools.domestic) ? tools.domestic : [];

        let html = `<td class="${cellClass}"><div class="cell-content">${tag}<div class="sop-list">`;
        sopList.forEach(s => {
            html += `<div class="sop-item">${s}</div>`;
        });
        html += '</div>';

        // 工具区始终渲染：无数据时显示占位标签，不再整块丢失
        html += '<div class="tools-section"><div class="tools-label">🔧 推荐工具</div>';
        if (intlTools.length || domesticTools.length) {
            intlTools.forEach(t => {
                html += `<span class="tool-tag international" data-tool="${t}">${t}</span>`;
            });
            domesticTools.forEach(t => {
                html += `<span class="tool-tag domestic" data-tool="${t}">${t}</span>`;
            });
        } else {
            html += '<span class="tool-tag placeholder">待补充</span>';
        }
        html += '</div></div></td>';
        return html;
    }

    // 渲染速赢行动清单
    renderQuickWins() {
        const grid = document.getElementById('quickwinsGrid');
        if (!grid) return;

        const list = (typeof quickWins !== 'undefined' && Array.isArray(quickWins)) ? quickWins : [];
        if (!list.length) {
            grid.innerHTML = '<div class="glass-card quickwin-card"><div class="quickwin-desc">⚠️ 行动清单数据缺失</div></div>';
            return;
        }

        grid.innerHTML = list.map((qw, i) => `
            <div class="glass-card quickwin-card fade-in delay-${i + 1}" data-index="${i}">
                <div class="quickwin-number">${i + 1}</div>
                <div class="quickwin-header">
                    <div class="quickwin-icon">${qw.icon}</div>
                    <div>
                        <div class="quickwin-title">${qw.title}</div>
                        <div class="quickwin-timeline">⏱️ ${qw.timeline}</div>
                    </div>
                </div>
                <div class="quickwin-desc">${qw.desc}</div>
                <div class="quickwin-kpi">
                    ${(Array.isArray(qw.kpis) ? qw.kpis : []).map(k => `
                        <div class="kpi-item">
                            <div class="kpi-value">${k.value}</div>
                            <div class="kpi-label">${k.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // 添加点击事件
        grid.querySelectorAll('.quickwin-card').forEach(card => {
            card.addEventListener('click', () => {
                const index = card.dataset.index;
                const qw = list[index];
                if (qw) {
                    window.toast.success(
                        qw.title,
                        `执行周期: ${qw.timeline}`,
                        4000
                    );
                }
            });
        });
    }

    // 渲染页脚数据源版本信息（缺失时显示兜底文案）
    renderFooter() {
        const el = document.getElementById('dataUpdatedAt');
        if (!el) return;

        const meta = window.dataSanitizer
            ? window.dataSanitizer.getMeta()
            : { version: '未知版本', updatedAt: '日期待同步' };
        el.textContent = `数据更新时间: ${meta.updatedAt} · 数据源版本: ${meta.version}`;
    }

    // 创建粒子效果
    createParticles() {
        const container = document.querySelector('.particles');
        if (!container) return;

        const colors = ['#a855f7', '#ec4899', '#06b6d4', '#10b981'];
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${15 + Math.random() * 10}s`;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.width = `${2 + Math.random() * 4}px`;
            particle.style.height = particle.style.width;
            container.appendChild(particle);
        }
    }

    initSidebar() {
        const sidebar = document.getElementById('diagnosticSidebar');
        const toggle = document.getElementById('sidebarToggle');
        const close = document.getElementById('sidebarClose');
        const body = document.getElementById('sidebarBody');
        if (!sidebar || !toggle || !close || !body) return;

        toggle.addEventListener('click', () => {
            sidebar.classList.add('open');
            toggle.style.opacity = '0';
            toggle.style.pointerEvents = 'none';
        });

        close.addEventListener('click', () => {
            sidebar.classList.remove('open');
            toggle.style.opacity = '1';
            toggle.style.pointerEvents = 'auto';
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                toggle.style.opacity = '1';
                toggle.style.pointerEvents = 'auto';
            }
        });

        this.renderSidebarContent(body);

        body.querySelectorAll('.sidebar-gap-card').forEach((card, i) => {
            card.addEventListener('click', () => {
                sidebar.classList.remove('open');
                toggle.style.opacity = '1';
                toggle.style.pointerEvents = 'auto';
                const targets = ['.charts-section', '.matrix-section', '.quickwins-section'];
                const target = document.querySelector(targets[i] || targets[0]);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    target.style.transition = 'box-shadow 0.5s ease';
                    target.style.boxShadow = '0 0 40px rgba(168, 85, 247, 0.5)';
                    setTimeout(() => { target.style.boxShadow = ''; }, 2000);
                }
            });
        });
    }

    renderSidebarContent(container) {
        const d = (typeof diagnosticSummary !== 'undefined' && diagnosticSummary && typeof diagnosticSummary === 'object')
            ? diagnosticSummary
            : null;
        if (!d || !d.currentPosition || !d.targetPosition) {
            container.innerHTML = '<div class="sidebar-section"><div class="sidebar-position-desc">⚠️ 诊断摘要数据缺失，请检查数据源后刷新</div></div>';
            return;
        }

        const sanitizer = window.dataSanitizer;
        const currentScore = sanitizer ? sanitizer.clampScore(d.currentPosition.score, 0) : 0;
        const targetScore = sanitizer ? sanitizer.clampScore(d.targetPosition.score, 0) : 0;
        const keyGaps = Array.isArray(d.keyGaps) ? d.keyGaps : [];
        let html = '';

        html += '<div class="sidebar-section">';
        html += '<div class="sidebar-section-title">📍 当前位置</div>';
        html += `
            <div class="sidebar-position-card is-current">
                <div class="sidebar-position-header">
                    <div class="sidebar-position-label" style="color: ${d.currentPosition.color}">${d.currentPosition.label}</div>
                    <div class="sidebar-position-subtitle">${d.currentPosition.subtitle}</div>
                </div>
                <div class="sidebar-score-bar">
                    <div class="sidebar-score-fill is-red" style="width: ${currentScore}%"></div>
                </div>
                <div class="sidebar-position-desc">${d.currentPosition.description}</div>
            </div>
        `;
        html += '</div>';

        html += '<div class="sidebar-section">';
        html += '<div class="sidebar-section-title">🎯 改进目标</div>';
        html += `
            <div class="sidebar-position-card is-target">
                <div class="sidebar-position-header">
                    <div class="sidebar-position-label" style="color: ${d.targetPosition.color}">${d.targetPosition.label}</div>
                    <div class="sidebar-position-subtitle">${d.targetPosition.subtitle}</div>
                </div>
                <div class="sidebar-score-bar">
                    <div class="sidebar-score-fill is-green" style="width: ${targetScore}%"></div>
                </div>
                <div class="sidebar-gap-badge">⚠️ ${d.targetPosition.gap}</div>
            </div>
        `;
        html += '</div>';

        html += '<div class="sidebar-section">';
        html += '<div class="sidebar-section-title">🔴 关键断层</div>';
        if (keyGaps.length) {
            keyGaps.forEach(gap => {
                const sevClass = gap.severity === 'critical' ? 'is-critical' : 'is-high';
                html += `
                    <div class="sidebar-gap-card ${sevClass}" data-gap-id="${gap.id}">
                        <div class="sidebar-gap-header">
                            <span class="sidebar-gap-icon">${gap.icon}</span>
                            <span class="sidebar-gap-title">${gap.title}</span>
                            <span class="sidebar-gap-severity ${sevClass}">${gap.severity === 'critical' ? '严重' : '高'}</span>
                        </div>
                        <div class="sidebar-gap-metric">
                            <span class="sidebar-gap-metric-value">${gap.metric}</span>
                            <span class="sidebar-gap-metric-label">${gap.metricLabel}</span>
                        </div>
                        <div class="sidebar-gap-desc">${gap.description}</div>
                    </div>
                `;
            });
        } else {
            html += '<div class="sidebar-position-desc">断层数据待补充</div>';
        }
        html += '</div>';

        container.innerHTML = html;

        requestAnimationFrame(() => {
            container.querySelectorAll('.sidebar-score-fill').forEach(el => {
                const w = el.style.width;
                el.style.width = '0%';
                requestAnimationFrame(() => { el.style.width = w; });
            });
        });
    }

    // 初始化所有组件（单模块失败不影响其余模块）
    init() {
        const steps = [
            ['createParticles', () => this.createParticles()],
            ['startTypewriter', () => this.startTypewriter()],
            ['renderStats', () => this.renderStats()],
            ['renderMatrix', () => this.renderMatrix()],
            ['renderQuickWins', () => this.renderQuickWins()],
            ['renderFooter', () => this.renderFooter()],
            ['initSidebar', () => this.initSidebar()]
        ];
        steps.forEach(([name, fn]) => {
            try {
                fn();
            } catch (err) {
                console.error(`组件初始化失败: ${name}`, err);
            }
        });

        // 数据兜底提示 / 欢迎提示
        const issues = window.dataSanitizer ? window.dataSanitizer.issues : [];
        setTimeout(() => {
            if (issues.length) {
                window.toast.warning(
                    '数据兜底已生效',
                    `${issues.length} 处缺失字段已按兜底档处理，补齐数据后刷新即可恢复正常`,
                    6000
                );
            } else {
                window.toast.success(
                    '欢迎使用诊断驾驶舱',
                    '数据已加载完成，点击各模块查看详情',
                    5000
                );
            }
        }, 1000);
    }
}

// 创建全局实例
window.componentRenderer = new ComponentRenderer();
