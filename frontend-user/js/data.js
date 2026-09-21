/* ========================================
   数据配置
   ======================================== */

// 矩阵数据
const matrixData = {
    dimensions: [
        { icon: '🎯', name: '全域获客', key: 'acquisition' },
        { icon: '👑', name: '权益体系', key: 'rights' },
        { icon: '💬', name: '私域触点', key: 'touchpoints' },
        { icon: '📊', name: '数据画像', key: 'cdp' },
        { icon: '🤖', name: '自动化营销', key: 'ma' },
        { icon: '🔧', name: '工具基建', key: 'martech' }
    ],
    phases: [
        { name: '阶段1: 沉睡通讯录', subtitle: '资产留存', key: 'phase1' },
        { name: '阶段2: 社交连接体', subtitle: '活跃与复购', key: 'phase2' },
        { name: '阶段3: 智能价值网', subtitle: '预测与生态', key: 'phase3' }
    ],
    cells: {
        acquisition: {
            phase1: {
                current: true,
                sop: ['门店扫码入会（流程复杂）', '罐内码扫码（体验差）', '包裹卡引流（无追踪）'],
                tools: { international: ['Google Analytics'], domestic: ['有赞', '微盟'] }
            },
            phase2: {
                target: true,
                sop: ['企微活码分渠道追踪', '裂变拉新（老带新奖励）', '公域转私域SOP（抖音/天猫）', '门店利益分成机制'],
                tools: { international: ['HubSpot'], domestic: ['企业微信', '句子互动', '尘锋SCRM'] }
            },
            phase3: {
                sop: ['AI智能投放优化', 'LTV预测筛选高价值潜客', '全域归因分析', '智能渠道预算分配'],
                tools: { international: ['Salesforce Marketing Cloud', 'Adobe Experience Cloud'], domestic: ['神策数据', '易观方舟'] }
            }
        },
        rights: {
            phase1: {
                current: true,
                sop: ['基础积分累计', '积分兑换礼品', '无等级体系', '储值卡推销'],
                tools: { international: [], domestic: ['有赞', '微盟'] }
            },
            phase2: {
                target: true,
                sop: ['会员等级体系（银/金/钻）', '付费会员Plus设计', '成长值任务体系', '专属权益差异化'],
                tools: { international: ['Salesforce Loyalty'], domestic: ['驿氪', '有赞'] }
            },
            phase3: {
                sop: ['动态权益个性化', 'LTV驱动权益分配', '积分通证化', '生态权益互通'],
                tools: { international: ['Adobe Real-Time CDP'], domestic: ['神策数据', '易观'] }
            }
        },
        touchpoints: {
            phase1: {
                current: true,
                sop: ['短信群发（打开率<1%）', '公众号推文', '无企微私域', '无社群运营'],
                tools: { international: [], domestic: ['公众号', '短信平台'] }
            },
            phase2: {
                target: true,
                sop: ['企微1v1私聊SOP', '社群分层运营', '视频号内容矩阵', '直播带货联动', '朋友圈剧本'],
                tools: { international: ['Intercom'], domestic: ['企业微信', '句子互动', '微伴助手', '腾讯企点'] }
            },
            phase3: {
                sop: ['AI智能客服', '个性化内容推荐', '全渠道消息中心', '智能外呼'],
                tools: { international: ['Salesforce Service Cloud', 'Zendesk'], domestic: ['智齿科技', '网易七鱼'] }
            }
        },
        cdp: {
            phase1: {
                current: true,
                sop: ['手机号=会员ID', '仅交易数据', '无行为追踪', '画像模糊'],
                tools: { international: [], domestic: ['Excel', 'ERP系统'] }
            },
            phase2: {
                target: true,
                sop: ['OneID统一身份', '静态标签体系', '行为事件追踪', 'RFM分层模型'],
                tools: { international: ['Segment', 'mParticle'], domestic: ['神策数据', '易观方舟', 'GrowingIO'] }
            },
            phase3: {
                sop: ['实时CDP', '预测性标签', 'AI画像生成', '跨平台数据打通'],
                tools: { international: ['Adobe Real-Time CDP', 'Salesforce CDP'], domestic: ['神策数据', '创略科技'] }
            }
        },
        ma: {
            phase1: {
                current: true,
                sop: ['无自动化', '人工群发', '无生命周期管理', '无MOT触发'],
                tools: { international: [], domestic: ['人工操作'] }
            },
            phase2: {
                target: true,
                sop: ['关键MOT自动触达', '生日/满月复购提醒', '流失预警自动挽回', '新客培育旅程'],
                tools: { international: ['HubSpot', 'Marketo'], domestic: ['句子互动', 'Convertlab', '致趣百川'] }
            },
            phase3: {
                sop: ['AI驱动营销决策', '智能时机优化', '个性化内容生成', '全渠道编排'],
                tools: { international: ['Salesforce Marketing Cloud', 'Adobe Journey Optimizer'], domestic: ['神策智能运营', 'Convertlab'] }
            }
        },
        martech: {
            phase1: {
                current: true,
                sop: ['小程序（体验差）', '罐内码（流程繁琐）', '系统割裂', '无数据中台'],
                tools: { international: [], domestic: ['微信小程序', '第三方扫码'] }
            },
            phase2: {
                target: true,
                sop: ['企微+SCRM一体化', '小程序体验优化', '数据中台搭建', 'BI看板'],
                tools: { international: ['Salesforce'], domestic: ['企业微信', '有赞', '微盟', '神策数据'] }
            },
            phase3: {
                sop: ['全域数据湖', 'AI中台', '智能决策引擎', 'API生态'],
                tools: { international: ['Snowflake', 'Databricks'], domestic: ['阿里云数据中台', '腾讯云CDP'] }
            }
        }
    }
};

// 速赢行动清单
const quickWins = [
    {
        icon: '🔗',
        title: '企微私域基建',
        timeline: '第1-4周',
        desc: '部署企业微信+SCRM系统，设计门店导购利益分成机制，解决渠道抵触问题。建立活码体系，实现渠道来源追踪。',
        kpis: [
            { value: '100%', label: '门店覆盖率' },
            { value: '50%', label: '导购激活率' }
        ]
    },
    {
        icon: '📱',
        title: '小程序体验重构',
        timeline: '第3-8周',
        desc: '简化入会流程至3步以内，优化罐内码扫码体验，增加即时奖励机制。将小程序从"积分工具"升级为"潜客蓄水池"。',
        kpis: [
            { value: '↓60%', label: '入会流失率' },
            { value: '↑3x', label: '扫码完成率' }
        ]
    },
    {
        icon: '🎬',
        title: '内容能力建设',
        timeline: '第5-12周',
        desc: '组建内部短视频团队，建立内容素材库，设计种草内容矩阵。从"枯燥医务知识"转向"场景化育儿内容"，驱动新客转化。',
        kpis: [
            { value: '30+', label: '月产内容数' },
            { value: '10%', label: '内容转化率' }
        ]
    }
];

// 统计卡片数据
const statsData = [
    { icon: '🎯', value: '拉新', label: '2026 核心战略', trend: null },
    { icon: '⚠️', value: '阶段1', label: '当前成熟度定位', trend: null },
    { icon: '🚀', value: '阶段2-3', label: '目标成熟度', trend: '+2级' },
    { icon: '🔥', value: '3个', label: '核心断层待解决', trend: null }
];

// 漏斗图数据
const funnelData = [
    { value: 100, name: '曝光触达', color: 'rgba(168, 85, 247, 0.9)' },
    { value: 45, name: '门店进店', color: 'rgba(168, 85, 247, 0.75)' },
    { value: 20, name: '扫码入会', color: 'rgba(236, 72, 153, 0.8)' },
    { value: 8, name: '首次购买', color: 'rgba(239, 68, 68, 0.85)' },
    { value: 3, name: '复购留存', color: 'rgba(239, 68, 68, 0.95)' }
];

const diagnosticSummary = {
    currentPosition: {
        label: '阶段1：沉睡通讯录',
        subtitle: '资产留存',
        score: 20,
        color: '#ef4444',
        description: '会员体系处于初始阶段，仅完成基础资产留存，六大维度均处于低位'
    },
    targetPosition: {
        label: '阶段2→3：社交连接体→智能价值网',
        subtitle: '活跃复购→预测生态',
        score: 80,
        color: '#10b981',
        gap: '+2级跨越'
    },
    keyGaps: [
        {
            id: 1,
            icon: '🔻',
            title: '获客→入会断层',
            severity: 'critical',
            metric: '100% → 20% → 8%',
            metricLabel: '曝光→入会→首购',
            description: '入会转化极低，门店导购无利益驱动机制，扫码流程复杂体验差'
        },
        {
            id: 2,
            icon: '🔄',
            title: '首购→复购断层',
            severity: 'critical',
            metric: '8% → 3%',
            metricLabel: '首购→复购留存',
            description: '无生命周期管理与MOT触达，无自动化培育旅程，流失无预警'
        },
        {
            id: 3,
            icon: '📡',
            title: '触达→自动化断层',
            severity: 'high',
            metric: '<1%',
            metricLabel: '短信打开率',
            description: '私域触点几乎空白，全靠人工群发，零自动化营销能力'
        }
    ]
};

// 雷达图数据
const radarData = {
    indicators: [
        { name: '全域获客', max: 100 },
        { name: '权益体系', max: 100 },
        { name: '私域触点', max: 100 },
        { name: '数据画像', max: 100 },
        { name: '自动化营销', max: 100 },
        { name: '工具基建', max: 100 }
    ],
    series: [
        {
            name: '佳贝艾特现状',
            value: [25, 20, 15, 20, 10, 30],
            color: '#ef4444',
            areaColor: 'rgba(239, 68, 68, 0.3)'
        },
        {
            name: '行业标杆',
            value: [85, 80, 90, 85, 80, 85],
            color: '#10b981',
            areaColor: 'rgba(16, 185, 129, 0.2)'
        }
    ]
};

// 数据源元信息：页脚以这里为准，避免继续使用旧的硬编码日期
const dashboardMeta = {
    dataVersion: 'v2026.09.21',
    sourceVersion: 'DS-2026-09-21',
    sourceName: '会员运营数据源',
    updatedAt: '2026-09-21 00:00:00'
};

const rawDashboardInput = {
    dashboardMeta,
    matrixData,
    quickWins,
    statsData,
    funnelData,
    diagnosticSummary,
    radarData
};

/* ========================================
   数据归一化与兜底
   ======================================== */

const DEFAULT_PHASES = [
    { name: '阶段1: 沉睡通讯录', subtitle: '资产留存', key: 'phase1', level: 1 },
    { name: '阶段2: 社交连接体', subtitle: '活跃与复购', key: 'phase2', level: 2 },
    { name: '阶段3: 智能价值网', subtitle: '预测与生态', key: 'phase3', level: 3 }
];

const DEFAULT_DIMENSIONS = [
    { icon: '🎯', name: '全域获客', key: 'acquisition' },
    { icon: '👑', name: '权益体系', key: 'rights' },
    { icon: '💬', name: '私域触点', key: 'touchpoints' },
    { icon: '📊', name: '数据画像', key: 'cdp' },
    { icon: '🤖', name: '自动化营销', key: 'ma' },
    { icon: '🔧', name: '工具基建', key: 'martech' }
];

const DEFAULT_FUNNEL_STAGES = ['曝光触达', '门店进店', '扫码入会', '首次购买', '复购留存'];
const DEFAULT_FUNNEL_COLORS = [
    'rgba(168, 85, 247, 0.9)',
    'rgba(168, 85, 247, 0.75)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(239, 68, 68, 0.85)',
    'rgba(239, 68, 68, 0.95)'
];
const DEFAULT_RADAR_COLORS = ['#ef4444', '#10b981'];

function isRecord(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}

function asText(value, fallback = '数据待补齐') {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'number') {
        return Number.isFinite(value) ? String(value) : fallback;
    }
    if (typeof value === 'string') {
        const text = value.trim();
        return text || fallback;
    }
    if (['number', 'boolean', 'bigint'].includes(typeof value)) return String(value);
    return fallback;
}

function asList(value) {
    if (value === null || value === undefined) return [];
    const list = Array.isArray(value) ? value : [value];
    return list
        .map(item => asText(item, ''))
        .filter(Boolean);
}

function finiteNumber(value, fallback = null) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}

function clamp(number, min, max) {
    return Math.min(max, Math.max(min, number));
}

function withAlpha(color, alpha) {
    const hexMatch = /^#([0-9a-f]{6})$/i.exec(color || '');
    if (hexMatch) {
        const red = parseInt(hexMatch[1].slice(0, 2), 16);
        const green = parseInt(hexMatch[1].slice(2, 4), 16);
        const blue = parseInt(hexMatch[1].slice(4, 6), 16);
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }
    return color;
}

function normalizeMeta(raw, issues) {
    const meta = isRecord(raw) ? raw : {};
    if (!isRecord(raw)) issues.push('缺少数据源元信息，已使用版本占位');

    return {
        dataVersion: asText(meta.dataVersion, '版本待同步'),
        sourceVersion: asText(meta.sourceVersion, '数据源版本待同步'),
        sourceName: asText(meta.sourceName, '数据源待同步'),
        updatedAt: asText(meta.updatedAt, '更新时间待同步')
    };
}

function normalizePhases(rawMatrix, issues) {
    const rawPhases = Array.isArray(rawMatrix.phases) ? rawMatrix.phases : [];
    if (!Array.isArray(rawMatrix.phases)) issues.push('矩阵缺少 phases 字段，已按三阶段成熟度模型兜底');

    return DEFAULT_PHASES.map((fallback, index) => {
        const candidate = rawPhases.find(item => isRecord(item) && item.key === fallback.key) || rawPhases[index];
        if (!isRecord(candidate)) {
            issues.push(`缺少${fallback.name}配置，已按固定档位兜底`);
            return { ...fallback };
        }

        if (!candidate.name) issues.push(`${fallback.name}缺少 name 字段`);
        if (!candidate.subtitle) issues.push(`${fallback.name}缺少 subtitle 字段`);

        return {
            key: fallback.key,
            level: fallback.level,
            name: asText(candidate.name, fallback.name),
            subtitle: asText(candidate.subtitle, fallback.subtitle)
        };
    });
}

function normalizeDimensions(rawMatrix, issues) {
    const rawDimensions = Array.isArray(rawMatrix.dimensions) ? rawMatrix.dimensions : [];
    if (!Array.isArray(rawMatrix.dimensions)) issues.push('矩阵缺少 dimensions 字段，已按六大运营维度兜底');

    return DEFAULT_DIMENSIONS.map((fallback, index) => {
        const candidate = rawDimensions.find(item => isRecord(item) && item.key === fallback.key) || rawDimensions[index];
        if (!isRecord(candidate)) {
            issues.push(`缺少维度「${fallback.name}」配置，已按默认维度兜底`);
            return { ...fallback };
        }

        if (!candidate.name) issues.push(`维度 ${fallback.key} 缺少 name 字段`);

        return {
            key: fallback.key,
            icon: asText(candidate.icon, fallback.icon),
            name: asText(candidate.name, fallback.name)
        };
    });
}

function normalizeTools(rawTools, path, issues) {
    const result = {
        international: [],
        domestic: [],
        status: 'complete',
        missingCategories: []
    };

    if (!isRecord(rawTools)) {
        result.international = [];
        result.domestic = [];
        result.status = 'missing';
        result.missingCategories = ['international', 'domestic'];
        issues.push(`${path} 缺少 tools 字段，工具区已占位`);
        return result;
    }

    ['international', 'domestic'].forEach(category => {
        if (Object.prototype.hasOwnProperty.call(rawTools, category)) {
            result[category] = asList(rawTools[category]);
        } else {
            result[category] = [];
            result.missingCategories.push(category);
            issues.push(`${path} 缺少 tools.${category} 字段`);
        }
    });

    const hasTools = result.international.length > 0 || result.domestic.length > 0;
    result.status = result.missingCategories.length > 0 ? 'partial' : hasTools ? 'complete' : 'empty';
    return result;
}

function normalizeCell(rawCell, dimension, phase, issues) {
    const path = `${dimension.name} / ${phase.name}`;
    const cell = isRecord(rawCell) ? rawCell : null;
    const fallbackReasons = [];

    if (!cell) {
        issues.push(`${path} 缺少单元格记录，已按该阶段档位兜底`);
        fallbackReasons.push('缺少整条单元格记录');
    }

    const sop = asList(cell?.sop);
    if (sop.length === 0) {
        issues.push(`${path} 缺少有效 sop 字段，已显示待补齐提示`);
        fallbackReasons.push('缺少 SOP');
        sop.push(`该阶段 SOP 待补齐（按${phase.name}档处理）`);
    }

    const tools = normalizeTools(cell?.tools, path, issues);
    if (tools.status === 'missing') fallbackReasons.push('缺少工具清单');
    if (tools.status === 'partial') fallbackReasons.push('部分工具分类缺失');

    const isFallback = fallbackReasons.length > 0;
    const current = Boolean(cell?.current);
    const target = Boolean(cell?.target);

    return {
        dimensionKey: dimension.key,
        phaseKey: phase.key,
        current,
        target,
        sop,
        tools,
        isFallback,
        cellStatus: !cell ? 'missing' : isFallback ? 'partial' : 'complete',
        tier: {
            level: phase.level,
            label: phase.name,
            subtitle: phase.subtitle
        },
        fallbackNote: isFallback
            ? `${fallbackReasons.join('、')}；本单元格按「${phase.name}｜${phase.subtitle}」档兜底，数据补齐并重新打开后恢复。`
            : ''
    };
}

function normalizeMatrix(raw, issues) {
    const matrix = isRecord(raw) ? raw : {};
    if (!isRecord(raw)) issues.push('矩阵数据不是对象，已使用完整兜底结构');

    const phases = normalizePhases(matrix, issues);
    const dimensions = normalizeDimensions(matrix, issues);
    const rawCells = isRecord(matrix.cells) ? matrix.cells : {};
    if (!isRecord(matrix.cells)) issues.push('矩阵缺少 cells 字段，所有单元格已按阶段占位');

    const cells = {};
    dimensions.forEach(dimension => {
        const dimensionCells = isRecord(rawCells[dimension.key]) ? rawCells[dimension.key] : {};
        if (!isRecord(rawCells[dimension.key])) {
            issues.push(`维度「${dimension.name}」缺少阶段数据，已逐阶段兜底`);
        }

        cells[dimension.key] = {};
        phases.forEach(phase => {
            cells[dimension.key][phase.key] = normalizeCell(
                dimensionCells[phase.key],
                dimension,
                phase,
                issues
            );
        });
    });

    return { phases, dimensions, cells };
}

function normalizeStats(raw, issues) {
    const fallbackStats = [
        { icon: '🎯', value: '--', label: '核心战略待补齐', trend: null },
        { icon: '⚠️', value: '--', label: '当前定位待补齐', trend: null },
        { icon: '🚀', value: '--', label: '目标成熟度待补齐', trend: null },
        { icon: '🔥', value: '--', label: '核心断层待补齐', trend: null }
    ];
    const rawStats = Array.isArray(raw) ? raw : [];
    if (!Array.isArray(raw) || raw.length === 0) {
        issues.push('统计卡片数据缺失，已显示占位卡片');
    }

    return fallbackStats.map((fallback, index) => {
        const stat = rawStats[index];
        if (!isRecord(stat)) {
            issues.push(`第 ${index + 1} 张统计卡片缺失，已兜底`);
            return { ...fallback };
        }
        return {
            icon: asText(stat.icon, fallback.icon),
            value: asText(stat.value, fallback.value),
            label: asText(stat.label, fallback.label),
            trend: stat.trend === null || stat.trend === undefined || stat.trend === ''
                ? null
                : asText(stat.trend, '--')
        };
    });
}

function normalizeFunnel(raw, issues) {
    const rawFunnel = Array.isArray(raw) ? raw : [];
    if (!Array.isArray(raw) || raw.length === 0) {
        issues.push('漏斗数据缺失，已保留漏斗环节并将数值显示为 --');
    }

    const normalized = DEFAULT_FUNNEL_STAGES.map((fallbackName, index) => {
        const item = isRecord(rawFunnel[index]) ? rawFunnel[index] : {};
        const name = item.name ? asText(item.name, fallbackName) : fallbackName;
        if (!isRecord(rawFunnel[index])) issues.push(`漏斗「${fallbackName}」数据缺失，数值已显示为 --`);

        const numericValue = finiteNumber(item.value, null);
        const validValue = numericValue === null ? 0 : clamp(numericValue, 0, 100);
        if (numericValue === null) {
            issues.push(`漏斗「${name}」缺少有效数值，计算按 0 处理、展示为 --`);
        } else if (numericValue !== validValue) {
            issues.push(`漏斗「${name}」数值超出 0-100，已按边界值兜底`);
        }

        return {
            name,
            value: validValue,
            displayValue: numericValue === null ? '--' : asText(item.displayValue, `${validValue}%`),
            color: asText(item.color, DEFAULT_FUNNEL_COLORS[index])
        };
    });

    rawFunnel.slice(DEFAULT_FUNNEL_STAGES.length).forEach((rawItem, offset) => {
        const index = DEFAULT_FUNNEL_STAGES.length + offset;
        const item = isRecord(rawItem) ? rawItem : {};
        const numericValue = finiteNumber(item.value, 0);
        normalized.push({
            name: asText(item.name, `漏斗环节${index + 1}`),
            value: clamp(numericValue, 0, 100),
            displayValue: asText(item.displayValue, `${clamp(numericValue, 0, 100)}%`),
            color: asText(item.color, DEFAULT_FUNNEL_COLORS[index % DEFAULT_FUNNEL_COLORS.length])
        });
    });

    return normalized;
}

function normalizeRadar(raw, issues) {
    const radar = isRecord(raw) ? raw : {};
    if (!isRecord(raw)) issues.push('雷达图数据缺失，已保留六个能力维度和占位序列');

    const rawIndicators = Array.isArray(radar.indicators) ? radar.indicators : [];
    const indicators = DEFAULT_DIMENSIONS.map((dimension, index) => {
        const candidate = rawIndicators.find(item => isRecord(item) && item.name === dimension.name) || rawIndicators[index];
        const max = finiteNumber(candidate?.max, 100);
        return {
            name: asText(candidate?.name, dimension.name),
            max: max > 0 ? max : 100
        };
    });

    let rawSeries = Array.isArray(radar.series) ? radar.series : [];
    if (rawSeries.length === 0) {
        issues.push('雷达图 series 缺失，已使用占位序列');
        rawSeries = [null, null];
    }

    const series = rawSeries.map((rawItem, index) => {
        const item = isRecord(rawItem) ? rawItem : {};
        if (!isRecord(rawItem)) issues.push(`雷达图第 ${index + 1} 条序列缺失，已占位`);

        const name = asText(item.name, `数据系列${index + 1}`);
        const color = asText(item.color, DEFAULT_RADAR_COLORS[index % DEFAULT_RADAR_COLORS.length]);
        const rawValues = Array.isArray(item.value) ? item.value : [];
        if (!Array.isArray(item.value)) issues.push(`雷达图「${name}」缺少 value 数组，已显示 --`);

        const value = indicators.map((indicator, valueIndex) => {
            const number = finiteNumber(rawValues[valueIndex], null);
            if (number === null && rawValues[valueIndex] !== null && rawValues[valueIndex] !== undefined) {
                issues.push(`雷达图「${name} / ${indicator.name}」数值无效，已显示 --`);
            }
            return number;
        });

        return {
            name,
            value,
            displayValues: value.map(number => number === null ? '--' : number),
            color,
            areaColor: asText(item.areaColor, withAlpha(color, 0.2))
        };
    });

    return { indicators, series };
}

function normalizeQuickWins(raw, issues) {
    const fallbackCard = index => ({
        icon: '📝',
        title: `速赢行动 ${index + 1}（待补齐）`,
        timeline: '--',
        desc: '该行动的数据字段缺失，已保留卡片位置，数据补齐后恢复完整结论。',
        kpis: [{ value: '--', label: '指标待补齐' }]
    });

    const rawCards = Array.isArray(raw) ? raw : [];
    if (!Array.isArray(raw) || raw.length === 0) {
        issues.push('速赢行动数据缺失，已显示占位卡片');
        return [fallbackCard(0)];
    }

    return rawCards.map((rawCard, index) => {
        const card = isRecord(rawCard) ? rawCard : {};
        if (!isRecord(rawCard)) issues.push(`第 ${index + 1} 张速赢卡片缺失，已兜底`);

        const rawKpis = Array.isArray(card.kpis) ? card.kpis.filter(isRecord) : [];
        const kpis = rawKpis.length > 0
            ? rawKpis.map(kpi => ({
                value: asText(kpi.value, '--'),
                label: asText(kpi.label, '指标待补齐')
            }))
            : [{ value: '--', label: '关键指标待补齐' }];

        if (rawKpis.length === 0) issues.push(`速赢行动「${asText(card.title, `第${index + 1}项`)}」缺少 KPI，已显示 --`);

        return {
            icon: asText(card.icon, '📝'),
            title: asText(card.title, fallbackCard(index).title),
            timeline: asText(card.timeline, '--'),
            desc: asText(card.desc, fallbackCard(index).desc),
            kpis
        };
    });
}

function normalizePosition(raw, fallback, issues, label) {
    const position = isRecord(raw) ? raw : {};
    if (!isRecord(raw)) issues.push(`${label}数据缺失，已占位`);

    const score = finiteNumber(position.score, null);
    const safeScore = score === null ? 0 : clamp(score, 0, 100);
    if (score === null) issues.push(`${label}缺少有效 score，进度条按 0% 处理、分值显示 --`);

    return {
        label: asText(position.label, fallback.label),
        subtitle: asText(position.subtitle, fallback.subtitle),
        score: safeScore,
        displayScore: score === null ? '--' : safeScore,
        color: asText(position.color, fallback.color),
        description: asText(position.description, fallback.description),
        gap: position.gap === undefined || position.gap === null ? null : asText(position.gap, '--')
    };
}

function normalizeDiagnostic(raw, issues) {
    const diagnostic = isRecord(raw) ? raw : {};
    if (!isRecord(raw)) issues.push('诊断摘要数据缺失，数据面板已使用占位内容');

    const currentPosition = normalizePosition(diagnostic.currentPosition, {
        label: '当前定位待补齐',
        subtitle: '--',
        color: '#94a3b8',
        description: '当前定位数据待补齐，已有其他维度结论不受影响。'
    }, issues, '当前定位');

    const targetPosition = normalizePosition(diagnostic.targetPosition, {
        label: '改进目标待补齐',
        subtitle: '--',
        color: '#94a3b8',
        description: '改进目标数据待补齐，已有其他维度结论不受影响。'
    }, issues, '改进目标');

    let keyGaps = Array.isArray(diagnostic.keyGaps) ? diagnostic.keyGaps : [];
    if (keyGaps.length === 0) {
        issues.push('关键断层数据缺失，已显示占位卡片');
        keyGaps = [null];
    }

    const normalizedGaps = keyGaps.map((rawGap, index) => {
        const gap = isRecord(rawGap) ? rawGap : {};
        if (!isRecord(rawGap)) issues.push(`第 ${index + 1} 个关键断层缺失，已兜底`);

        const severity = ['critical', 'high'].includes(gap.severity) ? gap.severity : 'high';
        if (gap.severity && !['critical', 'high'].includes(gap.severity)) {
            issues.push(`关键断层「${asText(gap.title, index + 1)}」严重级别无效，已按“高”展示`);
        }

        return {
            id: finiteNumber(gap.id, index + 1),
            icon: asText(gap.icon, '•'),
            title: asText(gap.title, `关键断层 ${index + 1}`),
            severity,
            metric: asText(gap.metric, '--'),
            metricLabel: asText(gap.metricLabel, '指标待补齐'),
            description: asText(gap.description, '断层说明待补齐。')
        };
    });

    return { currentPosition, targetPosition, keyGaps: normalizedGaps };
}

function buildDashboardData(input = {}) {
    const issues = [];
    const source = isRecord(input) ? input : {};
    const rawInput = { ...rawDashboardInput, ...source };
    const meta = normalizeMeta(rawInput.dashboardMeta, issues);
    const matrix = normalizeMatrix(rawInput.matrixData, issues);
    const stats = normalizeStats(rawInput.statsData, issues);
    const funnel = normalizeFunnel(rawInput.funnelData, issues);
    const radar = normalizeRadar(rawInput.radarData, issues);
    const quickWins = normalizeQuickWins(rawInput.quickWins, issues);
    const diagnostic = normalizeDiagnostic(rawInput.diagnosticSummary, issues);

    return {
        meta,
        matrix,
        stats,
        funnel,
        radar,
        quickWins,
        diagnostic,
        issues,
        dataQuality: {
            status: issues.length === 0 ? 'healthy' : 'degraded',
            fallbackPolicy: '缺失字段只在展示层按所在阶段/维度兜底，不回写数据源，也不改变已有的当前位置或改进目标结论。'
        }
    };
}

const dashboardData = buildDashboardData();
window.dashboardData = dashboardData;
window.buildDashboardData = buildDashboardData;
window.refreshDashboardData = (input = {}) => {
    window.dashboardData = buildDashboardData(input);
    return window.dashboardData;
};
