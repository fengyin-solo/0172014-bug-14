const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadDashboardData(input) {
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8'), context);
  return input === undefined
    ? context.window.dashboardData
    : context.window.buildDashboardData(input);
}

test('完整原始数据不触发兜底且不改变已有结论', () => {
  const data = loadDashboardData();

  assert.equal(data.issues.length, 0);
  assert.equal(data.matrix.phases.length, 3);
  assert.equal(data.matrix.dimensions.length, 6);
  assert.equal(data.matrix.cells.acquisition.phase1.current, true);
  assert.equal(data.matrix.cells.acquisition.phase2.target, true);
  assert.deepEqual(Array.from(data.radar.series[0].value), [25, 20, 15, 20, 10, 30]);
  assert.equal(data.meta.sourceVersion, 'DS-2026-09-21');
});

test('缺失单元格按对应阶段档位兜底，工具区和SOP均不空白', () => {
  const data = loadDashboardData({
    matrixData: {
      cells: {
        acquisition: {
          phase2: {
            target: true,
            tools: { international: ['HubSpot'] }
          }
        }
      }
    }
  });

  const cell = data.matrix.cells.acquisition.phase2;
  assert.equal(cell.target, true);
  assert.equal(cell.tier.level, 2);
  assert.match(cell.sop[0], /按阶段2/);
  assert.equal(cell.tools.status, 'partial');
  assert.deepEqual(Array.from(cell.tools.domestic), []);
  assert.match(cell.fallbackNote, /阶段2: 社交连接体/);

  const missing = data.matrix.cells.rights.phase3;
  assert.equal(missing.cellStatus, 'missing');
  assert.equal(missing.tier.level, 3);
  assert.ok(missing.sop.length > 0);
});

test('无效数字不会产出NaN，展示为占位符', () => {
  const data = loadDashboardData({
    funnelData: [{ value: Number.NaN }],
    radarData: { series: [{ value: [Number.NaN] }] },
    diagnosticSummary: { currentPosition: { score: Number.NaN } }
  });

  assert.equal(data.funnel[0].value, 0);
  assert.equal(data.funnel[0].displayValue, '--');
  assert.equal(data.radar.series[0].value[0], null);
  assert.equal(data.radar.series[0].displayValues[0], '--');
  assert.equal(data.diagnostic.currentPosition.score, 0);
  assert.equal(data.diagnostic.currentPosition.displayScore, '--');
  assert.equal(JSON.stringify(data).includes('NaN'), false);
});
