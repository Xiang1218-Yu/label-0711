import { MONTH_OPTIONS, RENT_CITY_OPTIONS, EDUCATION_TYPE_OPTIONS } from '../config/constants.js';
import { Format } from '../utils/format.js';

/**
 * 专项附加扣除项组件
 */
export class DeductionItem {
  constructor(options = {}) {
    this.options = {
      type: options.type,
      label: options.label || '',
      onChange: options.onChange || (() => {})
    };
    
    this.element = null;
    this.state = this.getInitialState();
  }
  
  getInitialState() {
    const defaults = {
      childEducation: { amount: 1, months: 12 },
      continuingEducation: { type: 'academic', months: 0 },
      seriousIllness: { amount: 0 },
      housingLoan: { months: 0 },
      housingRent: { cityTier: 'tier1', months: 0 },
      elderlySupport: { months: 0 },
      childCare: { amount: 1, months: 12 }
    };
    return defaults[this.options.type] || {};
  }
  
  getValue() {
    return this.state;
  }
  
  getYearlyAmount() {
    const { type } = this.options;
    const s = this.state;
    
    switch (type) {
      case 'childEducation':
        return s.amount * 1000 * s.months;
      case 'continuingEducation':
        if (s.type === 'academic') return 400 * s.months;
        return s.months > 0 ? 3600 : 0;
      case 'seriousIllness':
        return Math.min(s.amount || 0, 80000);
      case 'housingLoan':
        return 1000 * s.months;
      case 'housingRent':
        const rates = { tier1: 1500, tier2: 1100, tier3: 800 };
        return (rates[s.cityTier] || 0) * s.months;
      case 'elderlySupport':
        return 2000 * s.months;
      case 'childCare':
        return s.amount * 1000 * s.months;
      default:
        return 0;
    }
  }
  
  render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'deduction-item';
    wrapper.innerHTML = this.getTemplate();
    
    this.element = wrapper;
    this.bindEvents();
    this.updateDisplay();
    
    return wrapper;
  }
  
  getTemplate() {
    const { type, label } = this.options;
    
    let content = '';
    
    switch (type) {
      case 'childEducation':
      case 'childCare':
        content = `
          <div class="deduction-row">
            <label>人数</label>
            <select class="deduction-select" data-field="amount">
              ${[1,2,3,4,5].map(n => `<option value="${n}">${n}人</option>`).join('')}
            </select>
          </div>
          <div class="deduction-row">
            <label>享受月份</label>
            <select class="deduction-select" data-field="months">
              ${MONTH_OPTIONS.map(o => `<option value="${o.value}" ${o.value === 12 ? 'selected' : ''}>${o.label}</option>`).join('')}
            </select>
          </div>
        `;
        break;
        
      case 'continuingEducation':
        content = `
          <div class="deduction-row">
            <label>教育类型</label>
            <select class="deduction-select" data-field="type">
              ${EDUCATION_TYPE_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
            </select>
          </div>
          <div class="deduction-row">
            <label>享受月份</label>
            <select class="deduction-select" data-field="months">
              <option value="0">不享受</option>
              ${MONTH_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
            </select>
          </div>
        `;
        break;
        
      case 'seriousIllness':
        content = `
          <div class="deduction-row">
            <label>扣除金额</label>
            <div class="amount-input-wrap">
              <input type="text" class="deduction-input" data-field="amount" placeholder="0" />
              <span class="input-unit">元</span>
            </div>
            <span class="deduction-hint">上限80,000元</span>
          </div>
        `;
        break;
        
      case 'housingLoan':
      case 'elderlySupport':
        content = `
          <div class="deduction-row">
            <label>享受月份</label>
            <select class="deduction-select" data-field="months">
              <option value="0">不享受</option>
              ${MONTH_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
            </select>
          </div>
        `;
        break;
        
      case 'housingRent':
        content = `
          <div class="deduction-row">
            <label>城市等级</label>
            <select class="deduction-select" data-field="cityTier">
              ${RENT_CITY_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
            </select>
          </div>
          <div class="deduction-row">
            <label>享受月份</label>
            <select class="deduction-select" data-field="months">
              <option value="0">不享受</option>
              ${MONTH_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
            </select>
          </div>
        `;
        break;
    }
    
    return `
      <div class="deduction-header">
        <span class="deduction-label">${label}</span>
        <span class="deduction-amount">年度扣除：<strong>0</strong> 元</span>
      </div>
      <div class="deduction-body">${content}</div>
    `;
  }
  
  bindEvents() {
    const selects = this.element.querySelectorAll('.deduction-select');
    const inputs = this.element.querySelectorAll('.deduction-input');
    
    selects.forEach(select => {
      select.addEventListener('change', (e) => {
        const field = e.target.dataset.field;
        let value = e.target.value;
        
        if (field === 'amount' || field === 'months') {
          value = parseInt(value, 10);
        }
        
        this.state[field] = value;
        this.updateDisplay();
        this.options.onChange(this.state, this.getYearlyAmount());
      });
    });
    
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const field = e.target.dataset.field;
        const raw = e.target.value.replace(/[^\d]/g, '');
        const num = parseInt(raw, 10) || 0;
        
        this.state[field] = Math.min(num, 80000);
        this.updateDisplay();
        this.options.onChange(this.state, this.getYearlyAmount());
      });
      
      input.addEventListener('blur', (e) => {
        if (this.state.amount > 0) {
          e.target.value = Format.currencyInt(this.state.amount);
        }
      });
    });
  }
  
  updateDisplay() {
    const amountEl = this.element.querySelector('.deduction-amount strong');
    if (amountEl) {
      amountEl.textContent = Format.currencyInt(this.getYearlyAmount());
    }
  }
  
  reset() {
    this.state = this.getInitialState();
    
    const selects = this.element.querySelectorAll('.deduction-select');
    const inputs = this.element.querySelectorAll('.deduction-input');
    
    selects.forEach(select => {
      const field = select.dataset.field;
      if (this.state[field] !== undefined) {
        select.value = this.state[field];
      }
    });
    
    inputs.forEach(input => {
      input.value = '';
    });
    
    this.updateDisplay();
  }
}
