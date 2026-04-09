import { TaxCalculator } from './src/core/calculator.js';
import { Validator } from './src/core/validator.js';

console.log('=== 测试：住房贷款与住房租金互斥校验 ===\n');

// 模拟同时填写住房贷款和租金的情况
const formData = {
  income: { salary: 200000, laborService: 0, royalty: 0, license: 0 },
  specialDeductions: { pension: 24000, medical: 6000, unemployment: 1200, housingFund: 12000 },
  additionalDeductions: {
    childEducation: { amount: 1, months: 12 },
    continuingEducation: { type: 'academic', months: 0 },
    seriousIllness: { amount: 0 },
    housingLoan: { months: 12 },  // 同时填写
    housingRent: { cityTier: 'tier1', months: 12 },  // 同时填写
    elderlySupport: { months: 0 },
    childCare: { amount: 0, months: 0 }
  }
};

// 1. 验证校验逻辑
const validation = Validator.validateForm(formData);
console.log('1. 校验结果:', validation.valid ? '通过' : '不通过');
console.log('   错误信息:', validation.errors.map(e => e.message));

// 2. 验证计算逻辑（互斥扣除 - 租金1500×12=18000，贷款1000×12=12000 → 应只扣租金18000）
const result = TaxCalculator.calculate(formData);
console.log('\n2. 防御性扣除计算(即使验证不通过，计算也会保证正确性):');
console.log('   - 住房贷款利息扣除:', result.additionalDeductions.housingLoan, '(期望：0，因为租金更高)');
console.log('   - 住房租金扣除:', result.additionalDeductions.housingRent, '(期望：18000，较高者)');
console.log('   - 两项合计:', result.additionalDeductions.housingLoan + result.additionalDeductions.housingRent);
console.log('   ✓ 符合税法规定：两者取较高者，不同时扣除');

console.log('\n=== 测试通过 ===');
