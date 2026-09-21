/* ========================================
   数据兜底与清洗
   - 加载时就地补齐缺失字段，数据齐全时零改动
   - 缺失阶段统一按「阶段1档（起步）」兜底评估
   - 记录兜底清单，供界面提示；补齐数据后刷新自动恢复
   ======================================== */

class DataSanitizer {
    constructor() {
        this.issues = [];
    }

    // 数字兜底：非有限数 -> fallback，杜绝 NaN 进入图表
    toSafeNumber(value, fallback = 0) {
        const num = Number(value);
        return Number.isFinite(num) ? num : fallback;
    }

    // 文本兜底
    toSafeText(value, fallback = '') {
        return (typeof value === 'string' && value.trim()) ? value : fallback;
    }

    // 数组兜底
    toSafeArray(value) {
        return Array.isArray(value) ? value : [];
    }

    // 评分兜底：限制在 0-100
    clampScore(value, fallback = 0) {
        return Math.min(100, Math.max(0, this.toSafeNumber(value, fallback)));
    }

    logIssue(issue) {
        this.issues.push(issue);
        console.warn('[DataSanitizer]', issue);
    }

    // 一键清洗全部数据源，任一模块失败不影响其余模块
    run() {
        const tasks = [
            ['matrixData', () => typeof matrixData !== 'undefined' && this.normalizeMatrix(matrixData)],
            ['funnelData', () => typeof funnelData !== 'undefined' && this.normalizeFunnel(funnelData)],
            ['radarData', () => typeof radarData !== 'undefined' && this.normalizeRadar(radarData)],
            ['statsData', () => typeof statsData !== 'undefined' && this.normalizeStats(statsData)],
            ['quickWins', () => typeof quickWins !== 'undefined' && this.normalizeQuickWins(quickWins)],
            ['diagnosticSummary', () => typeof diagnosticSummary !== 'undefined' && this.normalizeDiagnostic(diagnosticSummary)]
        ];
        tasks.forEach(([name, fn]) => {
            try {
                fn();
            } catch (err) {
                console.error(`[DataSanitizer] ${name} 清洗失败`, err);
            }
        });
    }

    /* ---------- 战略矩阵 ---------- */
    normalizeMatrix(data) {
        if (!data || typeof data !== 'object') return;

        data.dimensions = this.toSafeArray(data.dimensions);
        data.phases = this.toSafeArray(data.phases);
        if (!data.cells || typeof data.cells !== 'object') {
            data.cells = {};
            this.logIssue('矩阵单元格数据整体缺失，已全部按兜底档处理');
        }

        data.phases.forEach((phase, i) => {
            if (!phase || typeof phase !== 'object') {
                data.phases[i] = phase = {};
            }
            phase.key = this.toSafeText(phase.key, `phase${i + 1}`);
            phase.name = this.toSafeText(phase.name, `阶段${i + 1}`);
            phase.subtitle = this.toSafeText(phase.subtitle, '待补充');
        });

        data.dimensions.forEach((dim, i) => {
            if (!dim || typeof dim !== 'object') {
                data.dimensions[i] = dim = {};
            }
            dim.name = this.toSafeText(dim.name, `未命名维度${i + 1}`);
            dim.icon = this.toSafeText(dim.icon, '📌');
            dim.key = this.toSafeText(dim.key, `dim${i + 1}`);

            if (!data.cells[dim.key] || typeof data.cells[dim.key] !== 'object') {
                data.cells[dim.key] = {};
                this.logIssue(`「${dim.name}」整行阶段数据缺失，已按阶段1档（起步）兜底`);
            }

            data.phases.forEach((phase) => {
                const row = data.cells[dim.key];
                if (!row[phase.key] || typeof row[phase.key] !== 'object') {
                    row[phase.key] = this.buildFallbackCell();
                }
                this.normalizeCell(row[phase.key], dim, phase);
            });
        });
    }

    // 缺失单元格兜底：空结构，占位文案由渲染层负责，不污染数据
    buildFallbackCell() {
        return {
            sop: [],
            tools: { international: [], domestic: [] }
        };
    }

    normalizeCell(cell, dim, phase) {
        cell.sop = this.toSafeArray(cell.sop).filter(s => typeof s === 'string' && s.trim());
        if (!cell.sop.length) {
            // 数据缺失：标记按阶段1档（起步）兜底评估
            cell.fallback = true;
            cell.assumedTier = '阶段1档（起步）';
            this.logIssue(`「${dim.name} · ${phase.name}」数据缺失，暂按阶段1档（起步）处理`);
        } else {
            // 数据有效时清除残留的内部兜底标记，保证重复清洗幂等：
            // 补齐数据后重新加载不会残留兜底状态
            delete cell.fallback;
            delete cell.assumedTier;
        }

        // 工具结构补齐，空数组由渲染层显示「待补充」占位，不再整块丢失
        if (!cell.tools || typeof cell.tools !== 'object') {
            cell.tools = { international: [], domestic: [] };
            this.logIssue(`「${dim.name} · ${phase.name}」工具数据缺失，已显示占位标签`);
        }
        cell.tools.international = this.toSafeArray(cell.tools.international);
        cell.tools.domestic = this.toSafeArray(cell.tools.domestic);

        // 仅在字段存在时归一化，完整数据零改动
        if ('current' in cell) cell.current = !!cell.current;
        if ('target' in cell) cell.target = !!cell.target;
    }

    /* ---------- 漏斗图 ---------- */
    normalizeFunnel(list) {
        if (!Array.isArray(list)) return;
        list.forEach((item, i) => {
            if (!item || typeof item !== 'object') {
                list[i] = item = {};
            }
            if (!Number.isFinite(Number(item.value))) {
                this.logIssue(`漏斗「${item.name || `第${i + 1}层`}」数值缺失/非法，已按 0 兜底`);
            }
            item.value = this.toSafeNumber(item.value, 0);
            item.name = this.toSafeText(item.name, `第${i + 1}层`);
            item.color = this.toSafeText(item.color, 'rgba(168, 85, 247, 0.7)');
        });
    }

    /* ---------- 雷达图 ---------- */
    normalizeRadar(data) {
        if (!data || typeof data !== 'object') return;

        data.indicators = this.toSafeArray(data.indicators);
        data.indicators.forEach((ind, i) => {
            if (!ind || typeof ind !== 'object') {
                data.indicators[i] = ind = {};
            }
            ind.name = this.toSafeText(ind.name, `维度${i + 1}`);
            ind.max = this.toSafeNumber(ind.max, 100) || 100;
        });

        data.series = this.toSafeArray(data.series);
        data.series.forEach((s, i) => {
            if (!s || typeof s !== 'object') {
                data.series[i] = s = {};
            }
            s.name = this.toSafeText(s.name, `系列${i + 1}`);
            const values = this.toSafeArray(s.value);
            // 与指标维度对齐，缺失位补 0，杜绝 NaN
            s.value = data.indicators.map((_, idx) => {
                if (!Number.isFinite(Number(values[idx]))) {
                    this.logIssue(`雷达图「${s.name}」第 ${idx + 1} 维数值缺失，已按 0 兜底`);
                }
                return this.toSafeNumber(values[idx], 0);
            });
            s.color = this.toSafeText(s.color, '#a855f7');
            s.areaColor = this.toSafeText(s.areaColor, 'rgba(168, 85, 247, 0.2)');
        });
    }

    /* ---------- 统计卡片 ---------- */
    normalizeStats(list) {
        if (!Array.isArray(list)) return;
        list.forEach((stat, i) => {
            if (!stat || typeof stat !== 'object') {
                list[i] = stat = {};
            }
            stat.icon = this.toSafeText(stat.icon, '📊');
            stat.value = this.toSafeText(String(stat.value ?? ''), '—');
            stat.label = this.toSafeText(stat.label, `指标${i + 1}`);
        });
    }

    /* ---------- 速赢行动清单 ---------- */
    normalizeQuickWins(list) {
        if (!Array.isArray(list)) return;
        list.forEach((qw, i) => {
            if (!qw || typeof qw !== 'object') {
                list[i] = qw = {};
            }
            qw.icon = this.toSafeText(qw.icon, '⚡');
            qw.title = this.toSafeText(qw.title, `行动项${i + 1}`);
            qw.timeline = this.toSafeText(qw.timeline, '周期待定');
            qw.desc = this.toSafeText(qw.desc, '方案待补充');
            qw.kpis = this.toSafeArray(qw.kpis);
            qw.kpis.forEach((kpi, j) => {
                if (!kpi || typeof kpi !== 'object') {
                    qw.kpis[j] = kpi = {};
                }
                kpi.value = this.toSafeText(String(kpi.value ?? ''), '—');
                kpi.label = this.toSafeText(kpi.label, '指标');
            });
        });
    }

    /* ---------- 诊断摘要侧栏 ---------- */
    normalizeDiagnostic(d) {
        if (!d || typeof d !== 'object') return;

        if (!d.currentPosition || typeof d.currentPosition !== 'object') {
            d.currentPosition = {};
            this.logIssue('诊断摘要「当前位置」缺失，已按兜底值展示');
        }
        d.currentPosition.label = this.toSafeText(d.currentPosition.label, '定位待评估');
        d.currentPosition.subtitle = this.toSafeText(d.currentPosition.subtitle, '—');
        d.currentPosition.score = this.clampScore(d.currentPosition.score, 0);
        d.currentPosition.color = this.toSafeText(d.currentPosition.color, '#ef4444');
        d.currentPosition.description = this.toSafeText(d.currentPosition.description, '数据待补充');

        if (!d.targetPosition || typeof d.targetPosition !== 'object') {
            d.targetPosition = {};
            this.logIssue('诊断摘要「改进目标」缺失，已按兜底值展示');
        }
        d.targetPosition.label = this.toSafeText(d.targetPosition.label, '目标待评估');
        d.targetPosition.subtitle = this.toSafeText(d.targetPosition.subtitle, '—');
        d.targetPosition.score = this.clampScore(d.targetPosition.score, 0);
        d.targetPosition.color = this.toSafeText(d.targetPosition.color, '#10b981');
        d.targetPosition.gap = this.toSafeText(d.targetPosition.gap, '差距待评估');

        d.keyGaps = this.toSafeArray(d.keyGaps);
        d.keyGaps.forEach((gap, i) => {
            if (!gap || typeof gap !== 'object') {
                d.keyGaps[i] = gap = {};
            }
            gap.id = this.toSafeNumber(gap.id, i + 1);
            gap.icon = this.toSafeText(gap.icon, '⚠️');
            gap.title = this.toSafeText(gap.title, `断层${i + 1}`);
            gap.severity = gap.severity === 'critical' ? 'critical' : 'high';
            gap.metric = this.toSafeText(String(gap.metric ?? ''), '—');
            gap.metricLabel = this.toSafeText(gap.metricLabel, '');
            gap.description = this.toSafeText(gap.description, '数据待补充');
        });
    }

    /* ---------- 数据源版本信息 ---------- */
    getMeta() {
        const meta = (typeof dataMeta !== 'undefined' && dataMeta && typeof dataMeta === 'object') ? dataMeta : {};
        return {
            version: this.toSafeText(meta.version, '未知版本'),
            updatedAt: this.toSafeText(meta.updatedAt, '日期待同步')
        };
    }
}

// 创建全局实例并立即执行就地兜底
window.dataSanitizer = new DataSanitizer();
window.dataSanitizer.run();
