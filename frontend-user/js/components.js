/* ========================================
   UI 组件渲染
   ======================================== */

class ComponentRenderer {
    constructor() {
        this.typewriterText = '基于2026年"拉新"战略核心，诊断当前会员体系成熟度，识别关键断层，规划升级路径...';
        this.charIndex = 0;
    }

    escapeText(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    get data() {
        return window.dashboardData;
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
    renderStats(data = this.data) {
        const container = document.getElementById('statsGrid');
        if (!container || !data) return;

        const stats = Array.isArray(data.stats) ? data.stats : [];
        container.innerHTML = stats.map((stat, index) => `
            <div class="glass-card stat-card fade-in delay-${index + 1}" data-index="${index}">
                <span class="stat-icon">${this.escapeText(stat.icon)}</span>
                <div class="stat-value">${this.escapeText(stat.value)}</div>
                <div class="stat-label">${this.escapeText(stat.label)}</div>
                ${stat.trend ? `<div class="stat-trend">${this.escapeText(stat.trend)}</div>` : ''}
            </div>
        `).join('');

        container.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', () => {
                const stat = stats[Number(card.dataset.index)];
                window.toast?.info(stat.label, `当前值: ${stat.value}`);
            });
        });
    }

    // 渲染矩阵表格
    renderMatrix(data = this.data) {
        const table = document.getElementById('matrixTable');
        if (!table || !data?.matrix) return;

        const { phases, dimensions, cells } = data.matrix;
        let html = '<thead><tr><th>运营维度</th>';

        phases.forEach(p => {
            html += `
                <th>
                    <div style="font-weight: 700;">${this.escapeText(p.name)}</div>
                    <div style="font-size: 12px; color: var(--neon-cyan); margin-top: 6px; opacity: 0.9;">
                        焦点: ${this.escapeText(p.subtitle)}
                    </div>
                </th>
            `;
        });
        html += '</tr></thead><tbody>';

        dimensions.forEach((dim, dimIndex) => {
            html += `<tr class="fade-in delay-${Math.min(dimIndex + 1, 5)}">`;
            html += `
                <td class="dimension-cell">
                    <span class="dimension-icon">${this.escapeText(dim.icon)}</span>
                    ${this.escapeText(dim.name)}
                </td>
            `;

            phases.forEach(phase => {
                const cell = cells[dim.key]?.[phase.key] || {
                    current: false,
                    target: false,
                    sop: [`该阶段 SOP 待补齐（按${phase.name}档处理）`],
                    tools: { international: [], domestic: [], status: 'missing' },
                    isFallback: true,
                    cellStatus: 'missing',
                    tier: { level: phase.level, label: phase.name, subtitle: phase.subtitle },
                    fallbackNote: `缺少单元格记录；本单元格按「${phase.name}｜${phase.subtitle}」档兜底。`
                };

                const classNames = [];
                if (cell.current) classNames.push('cell-current');
                if (cell.target) classNames.push('cell-target');
                if (cell.cellStatus === 'missing') classNames.push('cell-missing');
                if (cell.cellStatus === 'partial') classNames.push('cell-partial');

                const statusTags = [];
                if (cell.current) statusTags.push('<span class="status-tag tag-current">📍 当前位置</span>');
                if (cell.target) statusTags.push('<span class="status-tag tag-target">🎯 改进目标</span>');
                if (cell.cellStatus === 'missing') {
                    statusTags.push('<span class="status-tag tag-pending">🕳️ 数据待补齐</span>');
                } else if (cell.cellStatus === 'partial') {
                    statusTags.push('<span class="status-tag tag-partial">⚠️ 部分字段缺失</span>');
                }

                const sopItems = (Array.isArray(cell.sop) && cell.sop.length > 0 ? cell.sop : [
                    `该阶段 SOP 待补齐（按${phase.name}档处理）`
                ]).map(s => `<div class="sop-item">${this.escapeText(s)}</div>`).join('');

                const internationalTools = Array.isArray(cell.tools?.international) ? cell.tools.international : [];
                const domesticTools = Array.isArray(cell.tools?.domestic) ? cell.tools.domestic : [];
                let toolsHtml = '<div class="tools-section"><div class="tools-label">🔧 推荐工具</div>';

                if (internationalTools.length === 0 && domesticTools.length === 0) {
                    if (cell.tools?.status === 'partial') {
                        cell.tools.missingCategories.forEach(category => {
                            const label = category === 'international' ? '国际工具分类待补齐' : '国内工具分类待补齐';
                            toolsHtml += `<div class="tool-empty tool-empty-partial">${label}</div>`;
                        });
                    } else {
                        const emptyText = cell.tools?.status === 'empty'
                            ? '该阶段暂无推荐工具（数据源已标记为空）'
                            : '推荐工具待补齐，当前按阶段保留工具区';
                        toolsHtml += `<div class="tool-empty">${this.escapeText(emptyText)}</div>`;
                    }
                } else {
                    if (internationalTools.length === 0) {
                        toolsHtml += '<div class="tool-empty tool-empty-partial">国际工具分类待补齐</div>';
                    }
                    internationalTools.forEach(t => {
                        toolsHtml += `<span class="tool-tag international" data-tool="${this.escapeText(t)}">${this.escapeText(t)}</span>`;
                    });
                    if (domesticTools.length === 0) {
                        toolsHtml += '<div class="tool-empty tool-empty-partial">国内工具分类待补齐</div>';
                    }
                    domesticTools.forEach(t => {
                        toolsHtml += `<span class="tool-tag domestic" data-tool="${this.escapeText(t)}">${this.escapeText(t)}</span>`;
                    });
                }
                toolsHtml += '</div>';

                html += `
                    <td class="${classNames.join(' ')}">
                        <div class="cell-content">
                            <div class="cell-status-row">${statusTags.join('')}</div>
                            <div class="tier-note">成熟度档位：第 ${cell.tier.level} 档 · ${this.escapeText(cell.tier.label)}｜${this.escapeText(cell.tier.subtitle)}</div>
                            <div class="sop-list">${sopItems}</div>
                            ${toolsHtml}
                            ${cell.fallbackNote ? `<div class="fallback-note">${this.escapeText(cell.fallbackNote)}</div>` : ''}
                        </div>
                    </td>
                `;
            });
            html += '</tr>';
        });

        html += '</tbody>';
        table.innerHTML = html;

        table.querySelectorAll('.tool-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const toolName = tag.dataset.tool;
                const isInternational = tag.classList.contains('international');
                window.toast?.info(
                    '工具推荐',
                    `${toolName} - ${isInternational ? '国际工具' : '国内工具'}`,
                    3000
                );
            });
        });
    }

    // 渲染速赢行动清单
    renderQuickWins(data = this.data) {
        const grid = document.getElementById('quickwinsGrid');
        if (!grid || !data) return;

        const quickWins = Array.isArray(data.quickWins) ? data.quickWins : [];
        grid.innerHTML = quickWins.map((qw, i) => `
            <div class="glass-card quickwin-card fade-in delay-${i + 1}" data-index="${i}">
                <div class="quickwin-number">${i + 1}</div>
                <div class="quickwin-header">
                    <div class="quickwin-icon">${this.escapeText(qw.icon)}</div>
                    <div>
                        <div class="quickwin-title">${this.escapeText(qw.title)}</div>
                        <div class="quickwin-timeline">⏱️ ${this.escapeText(qw.timeline)}</div>
                    </div>
                </div>
                <div class="quickwin-desc">${this.escapeText(qw.desc)}</div>
                <div class="quickwin-kpi">
                    ${(qw.kpis || []).map(k => `
                        <div class="kpi-item">
                            <div class="kpi-value">${this.escapeText(k.value)}</div>
                            <div class="kpi-label">${this.escapeText(k.label)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.quickwin-card').forEach(card => {
            card.addEventListener('click', () => {
                const qw = quickWins[Number(card.dataset.index)];
                window.toast?.success(
                    qw.title,
                    `执行周期: ${qw.timeline}`,
                    4000
                );
            });
        });
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

    renderSidebarContent(container, data = this.data) {
        if (!container || !data?.diagnostic) {
            container.innerHTML = '<div class="sidebar-fallback">数据面板暂时不可读，请稍后刷新；矩阵与其他卡片不受影响。</div>';
            return;
        }

        const d = data.diagnostic;
        let html = '';

        html += '<div class="sidebar-section">';
        html += '<div class="sidebar-section-title">📍 当前位置</div>';
        html += `
            <div class="sidebar-position-card is-current">
                <div class="sidebar-position-header">
                    <div class="sidebar-position-label" style="color: ${this.escapeText(d.currentPosition.color)}">${this.escapeText(d.currentPosition.label)}</div>
                    <div class="sidebar-position-subtitle">${this.escapeText(d.currentPosition.subtitle)}</div>
                </div>
                <div class="sidebar-score-bar">
                    <div class="sidebar-score-fill is-red" style="width: ${d.currentPosition.score}%"></div>
                </div>
                <div class="sidebar-score-text">成熟度分值：${this.escapeText(d.currentPosition.displayScore)}</div>
                <div class="sidebar-position-desc">${this.escapeText(d.currentPosition.description)}</div>
            </div>
        `;
        html += '</div>';

        html += '<div class="sidebar-section">';
        html += '<div class="sidebar-section-title">🎯 改进目标</div>';
        html += `
            <div class="sidebar-position-card is-target">
                <div class="sidebar-position-header">
                    <div class="sidebar-position-label" style="color: ${this.escapeText(d.targetPosition.color)}">${this.escapeText(d.targetPosition.label)}</div>
                    <div class="sidebar-position-subtitle">${this.escapeText(d.targetPosition.subtitle)}</div>
                </div>
                <div class="sidebar-score-bar">
                    <div class="sidebar-score-fill is-green" style="width: ${d.targetPosition.score}%"></div>
                </div>
                <div class="sidebar-score-text">成熟度分值：${this.escapeText(d.targetPosition.displayScore)}</div>
                ${d.targetPosition.gap ? `<div class="sidebar-gap-badge">⚠️ ${this.escapeText(d.targetPosition.gap)}</div>` : ''}
            </div>
        `;
        html += '</div>';

        html += '<div class="sidebar-section">';
        html += '<div class="sidebar-section-title">🔴 关键断层</div>';
        d.keyGaps.forEach(gap => {
            const sevClass = gap.severity === 'critical' ? 'is-critical' : 'is-high';
            html += `
                <div class="sidebar-gap-card ${sevClass}" data-gap-id="${gap.id}">
                    <div class="sidebar-gap-header">
                        <span class="sidebar-gap-icon">${this.escapeText(gap.icon)}</span>
                        <span class="sidebar-gap-title">${this.escapeText(gap.title)}</span>
                        <span class="sidebar-gap-severity ${sevClass}">${gap.severity === 'critical' ? '严重' : '高'}</span>
                    </div>
                    <div class="sidebar-gap-metric">
                        <span class="sidebar-gap-metric-value">${this.escapeText(gap.metric)}</span>
                        <span class="sidebar-gap-metric-label">${this.escapeText(gap.metricLabel)}</span>
                    </div>
                    <div class="sidebar-gap-desc">${this.escapeText(gap.description)}</div>
                </div>
            `;
        });
        html += '</div>';

        html += '<div class="sidebar-section sidebar-data-health">';
        html += '<div class="sidebar-section-title">🛡️ 数据兜底</div>';
        if (data.issues.length === 0) {
            html += '<div class="data-health-card is-healthy">所有字段完整；当前位置、改进目标与六个维度均使用数据源原始结论。</div>';
        } else {
            html += `<div class="data-health-card is-degraded">检测到 ${data.issues.length} 个字段使用兜底，缺失内容按其所在成熟度档位处理。</div>`;
            html += '<ul class="data-health-list">';
            data.issues.slice(0, 8).forEach(issue => {
                html += `<li>${this.escapeText(issue)}</li>`;
            });
            if (data.issues.length > 8) {
                html += `<li>其余 ${data.issues.length - 8} 项异常已在控制台标记</li>`;
            }
            html += '</ul>';
            html += `<div class="data-health-policy">${this.escapeText(data.dataQuality.fallbackPolicy)}</div>`;
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

        if (data.issues.length > 0) {
            console.warn('Dashboard data fallback issues:', data.issues);
        }
    }

    renderFooter(data = this.data) {
        const footer = document.getElementById('dashboardFooter');
        if (!footer || !data?.meta) return;

        const issueText = data.issues.length > 0
            ? `<span class="footer-status is-degraded">兜底字段：${data.issues.length}</span>`
            : '<span class="footer-status is-healthy">字段完整</span>';

        footer.innerHTML = `
            <div class="footer-line">
                © 2026 佳贝艾特 会员运营诊断系统
                <span aria-hidden="true">|</span>
                数据源：${this.escapeText(data.meta.sourceName)}
                <span aria-hidden="true">|</span>
                数据源版本：${this.escapeText(data.meta.sourceVersion)}
                <span aria-hidden="true">|</span>
                数据更新时间：${this.escapeText(data.meta.updatedAt)}
            </div>
            <div class="footer-line footer-data-line">
                页面版本：${this.escapeText(data.meta.dataVersion)}
                ${issueText}
            </div>
        `;
    }

    renderDataNotice(data = this.data) {
        const container = document.getElementById('dataNotice');
        if (!container) return;

        if (!data || data.issues.length === 0) {
            container.hidden = true;
            container.innerHTML = '';
            return;
        }

        container.hidden = false;
        container.className = 'data-notice data-notice-warning glass-card';
        container.innerHTML = `
            <div class="data-notice-title">部分字段缺失，已按所在成熟度档位兜底</div>
            <div class="data-notice-desc">
                共 ${data.issues.length} 项使用兜底；已有阶段、维度、当前位置和目标结论未被改写。补齐数据源并重新打开页面后自动恢复。
            </div>
        `;
    }

    showRenderError(section, error) {
        console.error(`${section} 渲染失败`, error);
        window.toast?.error('模块渲染异常', `${section}已进入只读兜底视图，其他面板可继续查看`, 6000);
    }

    safeRender(name, callback) {
        try {
            callback();
        } catch (error) {
            this.showRenderError(name, error);
        }
    }

    // 初始化所有组件
    init() {
        this.safeRender('动态背景', () => this.createParticles());
        this.safeRender('诊断说明', () => this.startTypewriter());
        this.safeRender('数据版本', () => {
            this.renderDataNotice();
            this.renderFooter();
        });
        this.safeRender('统计卡片', () => this.renderStats());
        this.safeRender('战略矩阵', () => this.renderMatrix());
        this.safeRender('速赢行动', () => this.renderQuickWins());
        this.safeRender('诊断数据面板', () => this.initSidebar());

        // 显示欢迎提示
        setTimeout(() => {
            if (this.data.issues.length > 0) {
                window.toast?.warning(
                    '已启用字段兜底',
                    '缺失字段不会显示空白；补齐数据并重新打开页面后恢复',
                    6000
                );
            } else {
                window.toast?.success(
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
