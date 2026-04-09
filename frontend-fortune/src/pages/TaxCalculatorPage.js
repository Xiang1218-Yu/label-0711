import { InputNumber } from '../components/InputNumber.js';
import { DeductionItem } from '../components/DeductionItem.js';
import { ResultCard } from '../components/ResultCard.js';
import { ProcessPanel } from '../components/ProcessPanel.js';
import { Toast } from '../components/Toast.js';
import { TaxCalculator } from '../core/calculator.js';
import { Storage } from '../core/storage.js';
import { DEFAULT_VALUES } from '../config/constants.js';

/**
 * 个税计算器主页面
 */
export class TaxCalculatorPage {
  constructor(container) {
    this.container = container;
    this.inputs = {};
    this.deductions = {};
    this.resultCard = null;
    this.processPanel = null;
  }
  
  init() {
    this.render();
    this.bindEvents();
  }
  
  render() {
    this.container.innerHTML = `
      <header class="app-header">
        <h1>2025年中国个人所得税计算器</h1>
        <p class="subtitle">综合所得年度汇算</p>
      </header>
      
      <main class="app-main">
        <div class="panel-left">
          <section class="form-section">
            <h2 class="section-title">综合所得收入</h2>
            <div class="form-grid" id="income-inputs"></div>
          </section>
          
          <section class="form-section">
            <h2 class="section-title">专项扣除（三险一金）</h2>
            <div class="form-grid" id="special-inputs"></div>
          </section>
          
          <section class="form-section">
            <h2 class="section-title">专项附加扣除</h2>
            <div class="deduction-grid" id="additional-inputs"></div>
          </section>
          
          <div class="form-actions">
            <button type="button" class="btn btn-primary" id="btn-calculate">
              <span class="btn-text">开始计算</span>
              <span class="btn-loading" style="display:none;">计算中...</span>
            </button>
            <button type="button" class="btn btn-secondary" id="btn-reset">重置</button>
          </div>
        </div>
        
        <div class="panel-right">
          <section class="result-section">
            <h2 class="section-title">计算结果</h2>
            <div id="result-container"></div>
          </section>
          
          <section class="process-section">
            <div id="process-container"></div>
          </section>
        </div>
      </main>
      
      <footer class="app-footer">
        <p>本计算器仅供参考，实际纳税以税务机关核定为准</p>
      </footer>
    `;
    
    this.renderIncomeInputs();
    this.renderSpecialInputs();
    this.renderAdditionalInputs();
    this.renderResultComponents();
  }
  
  renderIncomeInputs() {
    const container = document.getElementById('income-inputs');
    
    const incomeFields = [
      { id: 'salary', label: '工资薪金（年）', value: DEFAULT_VALUES.salary },
      { id: 'laborService', label: '劳务报酬（年）', value: 0 },
      { id: 'royalty', label: '稿酬（年）', value: 0 },
      { id: 'license', label: '特许权使用费（年）', value: 0 }
    ];
    
    incomeFields.forEach(field => {
      const input = new InputNumber({
        id: `income-${field.id}`,
        label: field.label,
        value: field.value,
        onChange: () => {}
      });
      this.inputs[field.id] = input;
      container.appendChild(input.render());
    });
  }
  
  renderSpecialInputs() {
    const container = document.getElementById('special-inputs');
    
    const specialFields = [
      { id: 'pension', label: '基本养老保险（年）' },
      { id: 'medical', label: '基本医疗保险（年）' },
      { id: 'unemployment', label: '失业保险（年）' },
      { id: 'housingFund', label: '住房公积金（年）' }
    ];
    
    specialFields.forEach(field => {
      const input = new InputNumber({
        id: `special-${field.id}`,
        label: field.label,
        value: 0,
        onChange: () => {}
      });
      this.inputs[field.id] = input;
      container.appendChild(input.render());
    });
  }
  
  renderAdditionalInputs() {
    const container = document.getElementById('additional-inputs');
    
    const additionalFields = [
      { type: 'childEducation', label: '子女教育' },
      { type: 'continuingEducation', label: '继续教育' },
      { type: 'seriousIllness', label: '大病医疗' },
      { type: 'housingLoan', label: '住房贷款利息' },
      { type: 'housingRent', label: '住房租金' },
      { type: 'elderlySupport', label: '赡养老人' },
      { type: 'childCare', label: '婴幼儿照护' }
    ];
    
    additionalFields.forEach(field => {
      const item = new DeductionItem({
        type: field.type,
        label: field.label,
        onChange: (state, amount) => this.handleDeductionChange(field.type, state, amount)
      });
      this.deductions[field.type] = item;
      container.appendChild(item.render());
    });
  }
  
  /**
   * 处理专项附加扣除项变更
   * 实现住房贷款利息与住房租金的互斥逻辑
   */
  handleDeductionChange(type, state, amount) {
    // 住房贷款利息与住房租金互斥：选择一项时自动清空另一项
    if (type === 'housingLoan' && state.months > 0) {
      const rentItem = this.deductions.housingRent;
      if (rentItem && rentItem.state.months > 0) {
        rentItem.reset();
        Toast.info('已自动清空住房租金（与住房贷款利息不能同时享受）');
      }
    } else if (type === 'housingRent' && state.months > 0) {
      const loanItem = this.deductions.housingLoan;
      if (loanItem && loanItem.state.months > 0) {
        loanItem.reset();
        Toast.info('已自动清空住房贷款利息（与住房租金不能同时享受）');
      }
    }
  }
  
  renderResultComponents() {
    this.resultCard = new ResultCard();
    document.getElementById('result-container').appendChild(this.resultCard.render());
    
    this.processPanel = new ProcessPanel();
    document.getElementById('process-container').appendChild(this.processPanel.render());
  }
  
  bindEvents() {
    document.getElementById('btn-calculate').addEventListener('click', () => this.calculate());
    document.getElementById('btn-reset').addEventListener('click', () => this.confirmReset());
  }
  
  getFormData() {
    return {
      income: {
        salary: this.inputs.salary.value,
        laborService: this.inputs.laborService.value,
        royalty: this.inputs.royalty.value,
        license: this.inputs.license.value
      },
      specialDeductions: {
        pension: this.inputs.pension.value,
        medical: this.inputs.medical.value,
        unemployment: this.inputs.unemployment.value,
        housingFund: this.inputs.housingFund.value
      },
      additionalDeductions: {
        childEducation: this.deductions.childEducation.getValue(),
        continuingEducation: this.deductions.continuingEducation.getValue(),
        seriousIllness: this.deductions.seriousIllness.getValue(),
        housingLoan: this.deductions.housingLoan.getValue(),
        housingRent: this.deductions.housingRent.getValue(),
        elderlySupport: this.deductions.elderlySupport.getValue(),
        childCare: this.deductions.childCare.getValue()
      }
    };
  }
  
  calculate() {
    const btn = document.getElementById('btn-calculate');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = '';
    btn.disabled = true;
    
    setTimeout(() => {
      try {
        const formData = this.getFormData();
        const result = TaxCalculator.calculate(formData);
        
        this.resultCard.update(result);
        this.processPanel.update(result);
        
        Storage.saveRecord({ input: formData, result });
        Toast.success('计算完成');
      } catch (error) {
        console.error('计算错误:', error);
        Toast.error('计算出错，请检查输入');
      } finally {
        btnText.style.display = '';
        btnLoading.style.display = 'none';
        btn.disabled = false;
      }
    }, 300);
  }
  
  confirmReset() {
    if (confirm('确定要重置所有输入吗？')) {
      this.reset();
    }
  }
  
  reset() {
    Object.entries(this.inputs).forEach(([key, input]) => {
      const defaultValue = key === 'salary' ? DEFAULT_VALUES.salary : 0;
      input.reset(defaultValue);
    });
    
    Object.values(this.deductions).forEach(item => item.reset());
    
    this.resultCard.reset();
    this.processPanel.reset();
    
    Toast.info('已重置');
  }
}
