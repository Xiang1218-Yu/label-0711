import { TaxCalculator } from './src/core/calculator.js';
import { Validator } from './src/core/validator.js';

// 测试住房贷款利息与住房租金互斥检查

console.log('=== 测试住房贷款利息与住房租金互斥检查 ===\n');

// 测试用例1：同时选择住房贷款利息和住房租金 - 应该抛出错误
console.log('测试用例1：同时选择住房贷款利息（12个月）和住房租金（12个月）');
try {
  const data = {
    income: { salary: 100000, laborService: 0, royalty: 0, license: 0 },
    specialDeductions: { pension: 0, medical: 0, unemployment: 0, housingFund: 0 },
    additionalDeductions: {
      childEducation: { amount: 0, months: 0 },
      continuingEducation: { type: 'academic', months: 0 },
      seriousIllness: { amount: 0 },
      housingLoan: { months: 12 },
      housingRent: { cityTier: 'tier1', months: 12 },
      elderlySupport: { months: 0 },
      childCare: { amount: 0, months: 0 }
    }
  };
  
  // 先验证
  const validation = Validator.validateForm(data);
  console.log('  验证结果:', validation.valid ? '通过' : '失败');
  if (!validation.valid) {
    console.log('  错误信息:', validation.errors.map(e => e.message).join(', '));
  }
  
  // 再计算
  const result = TaxCalculator.calculate(data);
  console.log('  ❌ 错误：应该抛出异常，但计算成功了');
  console.log('  计算结果:', result.additionalDeductions);
} catch (error) {
  console.log('  ✅ 正确抛出异常:', error.message);
}

// 测试用例2：只选择住房贷款利息 - 应该正常计算
console.log('\n测试用例2：只选择住房贷款利息（12个月）');
try {
  const data = {
    income: { salary: 100000, laborService: 0, royalty: 0, license: 0 },
    specialDeductions: { pension: 0, medical: 0, unemployment: 0, housingFund: 0 },
    additionalDeductions: {
      childEducation: { amount: 0, months: 0 },
      continuingEducation: { type: 'academic', months: 0 },
      seriousIllness: { amount: 0 },
      housingLoan: { months: 12 },
      housingRent: { cityTier: 'tier1', months: 0 },
      elderlySupport: { months: 0 },
      childCare: { amount: 0, months: 0 }
    }
  };
  
  const validation = Validator.validateForm(data);
  console.log('  验证结果:', validation.valid ? '通过' : '失败');
  
  const result = TaxCalculator.calculate(data);
  console.log('  ✅ 计算成功');
  console.log('  住房贷款利息扣除:', result.additionalDeductions.housingLoan, '元');
  console.log('  住房租金扣除:', result.additionalDeductions.housingRent, '元');
} catch (error) {
  console.log('  ❌ 错误：不应该抛出异常:', error.message);
}

// 测试用例3：只选择住房租金 - 应该正常计算
console.log('\n测试用例3：只选择住房租金（12个月，一线城市）');
try {
  const data = {
    income: { salary: 100000, laborService: 0, royalty: 0, license: 0 },
    specialDeductions: { pension: 0, medical: 0, unemployment: 0, housingFund: 0 },
    additionalDeductions: {
      childEducation: { amount: 0, months: 0 },
      continuingEducation: { type: 'academic', months: 0 },
      seriousIllness: { amount: 0 },
      housingLoan: { months: 0 },
      housingRent: { cityTier: 'tier1', months: 12 },
      elderlySupport: { months: 0 },
      childCare: { amount: 0, months: 0 }
    }
  };
  
  const validation = Validator.validateForm(data);
  console.log('  验证结果:', validation.valid ? '通过' : '失败');
  
  const result = TaxCalculator.calculate(data);
  console.log('  ✅ 计算成功');
  console.log('  住房贷款利息扣除:', result.additionalDeductions.housingLoan, '元');
  console.log('  住房租金扣除:', result.additionalDeductions.housingRent, '元');
} catch (error) {
  console.log('  ❌ 错误：不应该抛出异常:', error.message);
}

// 测试用例4：两项都不选择 - 应该正常计算
console.log('\n测试用例4：两项都不选择');
try {
  const data = {
    income: { salary: 100000, laborService: 0, royalty: 0, license: 0 },
    specialDeductions: { pension: 0, medical: 0, unemployment: 0, housingFund: 0 },
    additionalDeductions: {
      childEducation: { amount: 0, months: 0 },
      continuingEducation: { type: 'academic', months: 0 },
      seriousIllness: { amount: 0 },
      housingLoan: { months: 0 },
      housingRent: { cityTier: 'tier1', months: 0 },
      elderlySupport: { months: 0 },
      childCare: { amount: 0, months: 0 }
    }
  };
  
  const validation = Validator.validateForm(data);
  console.log('  验证结果:', validation.valid ? '通过' : '失败');
  
  const result = TaxCalculator.calculate(data);
  console.log('  ✅ 计算成功');
  console.log('  住房贷款利息扣除:', result.additionalDeductions.housingLoan, '元');
  console.log('  住房租金扣除:', result.additionalDeductions.housingRent, '元');
} catch (error) {
  console.log('  ❌ 错误：不应该抛出异常:', error.message);
}

console.log('\n=== 测试完成 ===');
