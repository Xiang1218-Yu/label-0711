import { TaxCalculator } from './src/core/calculator.js';

console.log("\n======= 税法互斥规则测试：住房贷款利息 vs 住房租金 =======\n");

const baseData = {
  income: { salary: 200000, laborService: 0, royalty: 0, license: 0 },
  specialDeductions: { pension: 24000, medical: 6000, unemployment: 1200, housingFund: 24000 },
  additionalDeductions: {
    childEducation: { amount: 1, months: 0 },
    continuingEducation: { type: 'academic', months: 0 },
    seriousIllness: { amount: 0 },
    housingLoan: { months: 0 },
    housingRent: { cityTier: 'tier1', months: 0 },
    elderlySupport: { months: 0 },
    childCare: { amount: 1, months: 0 }
  }
};

console.log("情景1：同时申报住房贷款利息和住房租金");
const data1 = JSON.parse(JSON.stringify(baseData));
data1.additionalDeductions.housingLoan.months = 12;
data1.additionalDeductions.housingRent.months = 12;
const r1 = TaxCalculator.calculate(data1);
console.log("  住房贷款利息：", r1.additionalDeductions.housingLoan);
console.log("  住房租金：", r1.additionalDeductions.housingRent);
console.log("  同时申报标记：", r1.additionalDeductions.hasBothHousingDeductions);
console.log("  总扣除：", r1.additionalDeductions.housingLoan + r1.additionalDeductions.housingRent);
console.log("  预期：18000（租金较高，取租金值）");
const pass1 = r1.additionalDeductions.housingLoan + r1.additionalDeductions.housingRent === 18000 
  && r1.additionalDeductions.hasBothHousingDeductions === true;
console.log("  " + (pass1 ? "✓ PASS" : "✗ FAIL"));

console.log("\n情景2：只申报住房贷款");
const data2 = JSON.parse(JSON.stringify(baseData));
data2.additionalDeductions.housingLoan.months = 12;
const r2 = TaxCalculator.calculate(data2);
console.log("  住房贷款利息：%d, 住房租金：%d", r2.additionalDeductions.housingLoan, r2.additionalDeductions.housingRent);
console.log("  预期：贷款12000, 租金0");
const pass2 = r2.additionalDeductions.housingLoan === 12000 
  && r2.additionalDeductions.housingRent === 0
  && r2.additionalDeductions.hasBothHousingDeductions === false;
console.log("  " + (pass2 ? "✓ PASS" : "✗ FAIL"));

console.log("\n情景3：只申报住房租金");
const data3 = JSON.parse(JSON.stringify(baseData));
data3.additionalDeductions.housingRent.months = 12;
const r3 = TaxCalculator.calculate(data3);
console.log("  住房贷款利息：%d, 住房租金：%d", r3.additionalDeductions.housingLoan, r3.additionalDeductions.housingRent);
console.log("  预期：贷款0, 租金18000");
const pass3 = r3.additionalDeductions.housingLoan === 0 
  && r3.additionalDeductions.housingRent === 18000
  && r3.additionalDeductions.hasBothHousingDeductions === false;
console.log("  " + (pass3 ? "✓ PASS" : "✗ FAIL"));

console.log("\n情景4：两者都不申报");
const data4 = JSON.parse(JSON.stringify(baseData));
const r4 = TaxCalculator.calculate(data4);
console.log("  住房贷款利息：%d, 住房租金：%d", r4.additionalDeductions.housingLoan, r4.additionalDeductions.housingRent);
console.log("  预期：都为 0");
const pass4 = r4.additionalDeductions.housingLoan === 0 && r4.additionalDeductions.housingRent === 0;
console.log("  " + (pass4 ? "✓ PASS" : "✗ FAIL"));

console.log("\n============= 测试完成 ==============");
console.log("结果：" + (pass1 && pass2 && pass3 && pass4 ? "全部通过" : "部分失败"));
