// 测试住房贷款利息与住房租金互斥逻辑
import { TaxCalculator } from './frontend-fortune/src/core/calculator.js';

// 测试用例1：同时选择贷款和租金（贷款金额 > 租金金额）
const testData1 = {
  income: {
    salary: 180000,
    laborService: 0,
    royalty: 0,
    license: 0
  },
  specialDeductions: {
    pension: 0,
    medical: 0,
    unemployment: 0,
    housingFund: 0
  },
  additionalDeductions: {
    childEducation: { amount: 0, months: 0 },
    continuingEducation: { type: 'academic', months: 0 },
    seriousIllness: { amount: 0 },
    housingLoan: { months: 12 },  // 12000元
    housingRent: { cityTier: 'tier3', months: 12 },  // 9600元
    elderlySupport: { months: 0 },
    childCare: { amount: 0, months: 0 }
  }
};

console.log('=== 测试用例1：贷款12000元 vs 租金9600元 ===');
const result1 = TaxCalculator.calculate(testData1);
console.log('housingConflict:', result1.additionalDeductions.housingConflict);
console.log('housingLoan:', result1.additionalDeductions.housingLoan);
console.log('housingRent:', result1.additionalDeductions.housingRent);
console.log('预期：housingConflict=true, housingLoan=12000, housingRent=0');

// 测试用例2：同时选择贷款和租金（租金金额 > 贷款金额）
const testData2 = {
  income: {
    salary: 180000,
    laborService: 0,
    royalty: 0,
    license: 0
  },
  specialDeductions: {
    pension: 0,
    medical: 0,
    unemployment: 0,
    housingFund: 0
  },
  additionalDeductions: {
    childEducation: { amount: 0, months: 0 },
    continuingEducation: { type: 'academic', months: 0 },
    seriousIllness: { amount: 0 },
    housingLoan: { months: 12 },  // 12000元
    housingRent: { cityTier: 'tier1', months: 12 },  // 18000元
    elderlySupport: { months: 0 },
    childCare: { amount: 0, months: 0 }
  }
};

console.log('\n=== 测试用例2：贷款12000元 vs 租金18000元 ===');
const result2 = TaxCalculator.calculate(testData2);
console.log('housingConflict:', result2.additionalDeductions.housingConflict);
console.log('housingLoan:', result2.additionalDeductions.housingLoan);
console.log('housingRent:', result2.additionalDeductions.housingRent);
console.log('预期：housingConflict=true, housingLoan=0, housingRent=18000');

// 测试用例3：只选择贷款
const testData3 = {
  income: {
    salary: 180000,
    laborService: 0,
    royalty: 0,
    license: 0
  },
  specialDeductions: {
    pension: 0,
    medical: 0,
    unemployment: 0,
    housingFund: 0
  },
  additionalDeductions: {
    childEducation: { amount: 0, months: 0 },
    continuingEducation: { type: 'academic', months: 0 },
    seriousIllness: { amount: 0 },
    housingLoan: { months: 12 },  // 12000元
    housingRent: { cityTier: 'tier1', months: 0 },  // 0元
    elderlySupport: { months: 0 },
    childCare: { amount: 0, months: 0 }
  }
};

console.log('\n=== 测试用例3：只选择贷款12000元 ===');
const result3 = TaxCalculator.calculate(testData3);
console.log('housingConflict:', result3.additionalDeductions.housingConflict);
console.log('housingLoan:', result3.additionalDeductions.housingLoan);
console.log('housingRent:', result3.additionalDeductions.housingRent);
console.log('预期：housingConflict=false, housingLoan=12000, housingRent=0');
