import { Format } from '../utils/format.js';

/**
 * 计算结果展示组件
 */
export class ResultCard {
  constructor() {
    this.element = null;
    this.result = null;
  }
  
  render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'result-card';
    wrapper.innerHTML = `
      <div class="result-placeholder">
        <div class="placeholder-icon">📊</div>
        <p>输入收入和扣除信息后<br/>点击"开始计算"查看结果</p>
      </div>
      <div class="result-content" style="display: none;">
        <div class="result-main">
          <div class="result-item result-highlight">
            <span class="result-label">应纳税额</span>
            <span class="result-value tax-amount">0.00</span>
            <span class="result-unit">元</span>
          </div>
          <div class="result-item">
            <span class="result-label">税后收入</span>
            <span class="result-value after-tax">0.00</span>
            <span class="result-unit">元</span>
          </div>
        </div>
        <div class="result-details">
          <div class="result-row">
            <span>综合所得收入额</span>
            <span class="total-income">0</span>
          </div>
          <div class="result-row">
            <span>应纳税所得额</span>
            <span class="taxable-income">0</span>
          </div>
          <div class="result-row">
            <span>适用税率</span>
            <span class="tax-rate">0%</span>
          </div>
          <div class="result-row">
            <span>速算扣除数</span>
            <span class="quick-deduction">0</span>
          </div>
        </div>
      </div>
    `;
    
    this.element = wrapper;
    return wrapper;
  }
  
  update(result) {
    this.result = result;
    
    const placeholder = this.element.querySelector('.result-placeholder');
    const content = this.element.querySelector('.result-content');
    
    placeholder.style.display = 'none';
    content.style.display = '';
    content.style.opacity = '0';
    
    // 更新数值
    this.element.querySelector('.tax-amount').textContent = Format.currency(result.taxAmount);
    this.element.querySelector('.after-tax').textContent = Format.currency(result.afterTaxIncome);
    this.element.querySelector('.total-income').textContent = Format.currencyInt(result.income.totalIncome) + ' 元';
    this.element.querySelector('.taxable-income').textContent = Format.currencyInt(result.taxableIncome) + ' 元';
    this.element.querySelector('.tax-rate').textContent = Format.percent(result.taxRatePercent);
    this.element.querySelector('.quick-deduction').textContent = Format.currencyInt(result.quickDeduction) + ' 元';
    
    // 淡入动画
    requestAnimationFrame(() => {
      content.style.transition = 'opacity 0.3s ease';
      content.style.opacity = '1';
    });
  }
  
  reset() {
    this.result = null;
    
    const placeholder = this.element.querySelector('.result-placeholder');
    const content = this.element.querySelector('.result-content');
    
    placeholder.style.display = '';
    content.style.display = 'none';
  }
}
