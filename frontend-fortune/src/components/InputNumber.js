import { Format } from '../utils/format.js';

/**
 * 数字输入组件（带±100步进按钮）
 */
export class InputNumber {
  constructor(options = {}) {
    this.options = {
      id: options.id || `input-${Date.now()}`,
      label: options.label || '',
      value: options.value || 0,
      min: options.min ?? 0,
      max: options.max ?? Infinity,
      step: options.step ?? 100,
      unit: options.unit || '元',
      placeholder: options.placeholder || '请输入金额',
      onChange: options.onChange || (() => {}),
      disabled: options.disabled || false
    };
    
    this.element = null;
    this.input = null;
    this.errorEl = null;
    this._value = this.options.value;
  }
  
  get value() {
    return this._value;
  }
  
  set value(val) {
    this._value = Math.max(this.options.min, Math.min(this.options.max, val));
    if (this.input) {
      this.input.value = this._value > 0 ? Format.currencyInt(this._value) : '';
    }
  }
  
  render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'input-number-wrapper';
    wrapper.innerHTML = `
      <label class="input-label" for="${this.options.id}">${this.options.label}</label>
      <div class="input-number-container">
        <button type="button" class="step-btn step-minus" ${this.options.disabled ? 'disabled' : ''}>−</button>
        <input 
          type="text" 
          id="${this.options.id}" 
          class="input-number" 
          placeholder="${this.options.placeholder}"
          value="${this._value > 0 ? Format.currencyInt(this._value) : ''}"
          ${this.options.disabled ? 'disabled' : ''}
        />
        <span class="input-unit">${this.options.unit}</span>
        <button type="button" class="step-btn step-plus" ${this.options.disabled ? 'disabled' : ''}>+</button>
      </div>
      <div class="input-error"></div>
    `;
    
    this.element = wrapper;
    this.input = wrapper.querySelector('.input-number');
    this.errorEl = wrapper.querySelector('.input-error');
    
    this.bindEvents();
    return wrapper;
  }
  
  bindEvents() {
    const minusBtn = this.element.querySelector('.step-minus');
    const plusBtn = this.element.querySelector('.step-plus');
    
    minusBtn.addEventListener('click', () => this.step(-1));
    plusBtn.addEventListener('click', () => this.step(1));
    
    this.input.addEventListener('input', (e) => this.handleInput(e));
    this.input.addEventListener('blur', () => this.handleBlur());
    this.input.addEventListener('focus', () => this.handleFocus());
  }
  
  step(direction) {
    const newValue = this._value + (direction * this.options.step);
    this.setValue(newValue);
  }
  
  handleInput(e) {
    const raw = e.target.value.replace(/[^\d.-]/g, '');
    const num = parseFloat(raw) || 0;
    
    if (num < this.options.min) {
      this.showError(`不能小于${this.options.min}`);
    } else if (num > this.options.max) {
      this.showError(`不能超过${Format.currencyInt(this.options.max)}`);
    } else {
      this.clearError();
    }
  }
  
  handleBlur() {
    const raw = this.input.value.replace(/[^\d.-]/g, '');
    const num = parseFloat(raw) || 0;
    this.setValue(num);
  }
  
  handleFocus() {
    if (this._value > 0) {
      this.input.value = this._value;
    }
  }
  
  setValue(val) {
    const oldValue = this._value;
    this._value = Math.max(this.options.min, Math.min(this.options.max, val));
    this.input.value = this._value > 0 ? Format.currencyInt(this._value) : '';
    this.clearError();
    
    if (oldValue !== this._value) {
      this.options.onChange(this._value, oldValue);
    }
  }
  
  showError(message) {
    this.errorEl.textContent = message;
    this.element.classList.add('has-error');
  }
  
  clearError() {
    this.errorEl.textContent = '';
    this.element.classList.remove('has-error');
  }
  
  reset(defaultValue = 0) {
    this.setValue(defaultValue);
    this.clearError();
  }
}
