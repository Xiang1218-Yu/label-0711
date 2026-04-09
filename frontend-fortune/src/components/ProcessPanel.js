import { Format } from '../utils/format.js';

/**
 * 计税过程展示组件
 */
export class ProcessPanel {
  constructor() {
    this.element = null;
    this.expanded = false;
  }
  
  render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'process-panel';
    wrapper.innerHTML = `
      <div class="process-header">
        <span class="process-title">计税过程明细</span>
        <button type="button" class="process-toggle">展开 ▼</button>
      </div>
      <div class="process-body" style="display: none;">
        <div class="process-steps"></div>
      </div>
    `;
    
    this.element = wrapper;
    this.bindEvents();
    
    return wrapper;
  }
  
  bindEvents() {
    const toggle = this.element.querySelector('.process-toggle');
    const body = this.element.querySelector('.process-body');
    
    toggle.addEventListener('click', () => {
      this.expanded = !this.expanded;
      body.style.display = this.expanded ? '' : 'none';
      toggle.textContent = this.expanded ? '收起 ▲' : '展开 ▼';
    });
  }
  
  update(result) {
    const stepsEl = this.element.querySelector('.process-steps');
    
    const steps = [
      {
        title: '1. 综合所得收入额计算',
        items: [
          { label: '工资薪金收入额', value: result.income.salaryIncome, formula: '工资薪金 × 100%' },
          { label: '劳务报酬收入额', value: result.income.laborServiceIncome, formula: '劳务报酬 × 80%' },
          { label: '稿酬收入额', value: result.income.royaltyIncome, formula: '稿酬 × 80% × 70%' },
          { label: '特许权使用费收入额', value: result.income.licenseIncome, formula: '特许权使用费 × 80%' },
          { label: '综合所得收入额合计', value: result.income.totalIncome, highlight: true }
        ]
      },
      {
        title: '2. 专项附加扣除明细',
        items: [
          { label: '子女教育', value: result.additionalDeductions.childEducation },
          { label: '继续教育', value: result.additionalDeductions.continuingEducation },
          { label: '大病医疗', value: result.additionalDeductions.seriousIllness },
          { label: '住房贷款利息', value: result.additionalDeductions.housingLoan, warn: result.additionalDeductions.housingConflict },
          { label: '住房租金', value: result.additionalDeductions.housingRent, warn: result.additionalDeductions.housingConflict },
          { label: '赡养老人', value: result.additionalDeductions.elderlySupport },
          { label: '婴幼儿照护', value: result.additionalDeductions.childCare },
          { label: '专项附加扣除合计', value: result.additionalDeductions.total, highlight: true }
        ]
      },
      {
        title: '3. 累计扣除总额',
        items: [
          { label: '年度起征点', value: result.threshold },
          { label: '专项扣除（三险一金）', value: result.specialDeductions.total },
          { label: '专项附加扣除', value: result.additionalDeductions.total },
          { label: '累计扣除总额', value: result.totalDeductions, highlight: true }
        ]
      },
      {
        title: '4. 应纳税所得额',
        items: [
          { label: '应纳税所得额', value: result.taxableIncome, formula: '收入额 - 扣除总额', highlight: true }
        ]
      },
      {
        title: '5. 适用税率与速算扣除数',
        items: [
          { label: '税率级数', value: `第${result.taxLevel}级`, isText: true },
          { label: '适用税率', value: `${result.taxRatePercent}%`, isText: true },
          { label: '速算扣除数', value: result.quickDeduction }
        ]
      },
      {
        title: '6. 应纳税额',
        items: [
          { label: '应纳税额', value: result.taxAmount, formula: '应纳税所得额 × 税率 - 速算扣除数', highlight: true }
        ]
      }
    ];
    
    stepsEl.innerHTML = steps.map(step => `
      <div class="process-step">
        <div class="step-title">${step.title}</div>
        <div class="step-items">
          ${step.items.map(item => `
            <div class="step-item ${item.highlight ? 'highlight' : ''} ${item.warn && item.value === 0 ? 'warn' : ''}">
              <span class="item-label">${item.label}${item.warn && item.value === 0 ? ' (未享受)' : ''}</span>
              ${item.formula ? `<span class="item-formula">${item.formula}</span>` : ''}
              <span class="item-value">${item.isText ? item.value : Format.currencyInt(item.value) + ' 元'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
    
    // 自动展开
    if (!this.expanded) {
      this.expanded = true;
      this.element.querySelector('.process-body').style.display = '';
      this.element.querySelector('.process-toggle').textContent = '收起 ▲';
    }
  }
  
  reset() {
    this.expanded = false;
    this.element.querySelector('.process-body').style.display = 'none';
    this.element.querySelector('.process-toggle').textContent = '展开 ▼';
    this.element.querySelector('.process-steps').innerHTML = '';
  }
}
