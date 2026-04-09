import { TAX_RULES, getTaxBracket } from '../config/taxRules.js';

/**
 * 个人所得税计算器核心逻辑
 */
export class TaxCalculator {
  /**
   * 计算综合所得收入额
   */
  static calculateTotalIncome(income) {
    const { salary = 0, laborService = 0, royalty = 0, license = 0 } = income;
    const coefficients = TAX_RULES.incomeCoefficients;
    
    return {
      salaryIncome: salary * coefficients.salary,
      laborServiceIncome: laborService * coefficients.laborService,
      royaltyIncome: royalty * coefficients.royalty,
      licenseIncome: license * coefficients.license,
      totalIncome: salary * coefficients.salary +
                   laborService * coefficients.laborService +
                   royalty * coefficients.royalty +
                   license * coefficients.license
    };
  }
  
  /**
   * 计算专项扣除总额
   */
  static calculateSpecialDeductions(deductions) {
    const {
      pension = 0,      // 养老保险
      medical = 0,      // 医疗保险
      unemployment = 0, // 失业保险
      housingFund = 0   // 住房公积金
    } = deductions;
    
    return {
      pension,
      medical,
      unemployment,
      housingFund,
      total: pension + medical + unemployment + housingFund
    };
  }
  
  /**
   * 计算专项附加扣除总额
   */
  static calculateAdditionalDeductions(deductions) {
    const {
      childEducation = { amount: 0, months: 0 },
      continuingEducation = { type: 'academic', months: 0 },
      seriousIllness = { amount: 0 },
      housingLoan = { months: 0 },
      housingRent = { cityTier: 'tier1', months: 0 },
      elderlySupport = { months: 0 },
      childCare = { amount: 0, months: 0 }
    } = deductions;
    
    // 子女教育：1000元/月/子女
    const childEducationAmount = childEducation.amount * 1000 * childEducation.months;
    
    // 继续教育
    let continuingEducationAmount = 0;
    if (continuingEducation.type === 'academic') {
      continuingEducationAmount = 400 * continuingEducation.months;
    } else if (continuingEducation.type === 'professional') {
      continuingEducationAmount = continuingEducation.months > 0 ? 3600 : 0;
    }
    
    // 大病医疗：据实扣除，上限80000
    const seriousIllnessAmount = Math.min(seriousIllness.amount || 0, 80000);
    
    // 住房贷款利息：1000元/月
    // 住房租金：按城市等级
    // 根据税法规定，两者不能同时享受，取金额较高者
    const rentRates = { tier1: 1500, tier2: 1100, tier3: 800 };
    let housingLoanAmount = 1000 * housingLoan.months;
    let housingRentAmount = (rentRates[housingRent.cityTier] || 0) * housingRent.months;
    
    // 互斥逻辑：不能同时享受
    if (housingLoan.months > 0 && housingRent.months > 0) {
      if (housingLoanAmount >= housingRentAmount) {
        housingRentAmount = 0;
      } else {
        housingLoanAmount = 0;
      }
    }
    
    // 赡养老人：2000元/月
    const elderlySupportAmount = 2000 * elderlySupport.months;
    
    // 婴幼儿照护：1000元/月/婴幼儿
    const childCareAmount = childCare.amount * 1000 * childCare.months;
    
    return {
      childEducation: childEducationAmount,
      continuingEducation: continuingEducationAmount,
      seriousIllness: seriousIllnessAmount,
      housingLoan: housingLoanAmount,
      housingRent: housingRentAmount,
      elderlySupport: elderlySupportAmount,
      childCare: childCareAmount,
      total: childEducationAmount + continuingEducationAmount + seriousIllnessAmount +
             housingLoanAmount + housingRentAmount + elderlySupportAmount + childCareAmount
    };
  }
  
  /**
   * 完整计税流程
   */
  static calculate(data) {
    const { income, specialDeductions, additionalDeductions } = data;
    
    // 1. 计算综合所得收入额
    const incomeResult = this.calculateTotalIncome(income);
    
    // 2. 计算专项扣除
    const specialResult = this.calculateSpecialDeductions(specialDeductions);
    
    // 3. 计算专项附加扣除
    const additionalResult = this.calculateAdditionalDeductions(additionalDeductions);
    
    // 4. 计算累计扣除总额
    const totalDeductions = TAX_RULES.threshold + specialResult.total + additionalResult.total;
    
    // 5. 计算应纳税所得额
    const taxableIncome = Math.max(0, incomeResult.totalIncome - totalDeductions);
    
    // 6. 获取适用税率和速算扣除数
    const bracket = getTaxBracket(taxableIncome);
    
    // 7. 计算应纳税额
    const taxAmount = Math.max(0, taxableIncome * bracket.rate - bracket.deduction);
    
    // 8. 计算税后收入（综合所得总收入 - 专项扣除 - 应纳税额）
    const grossIncome = income.salary + income.laborService + income.royalty + income.license;
    const afterTaxIncome = grossIncome - specialResult.total - taxAmount;
    
    return {
      // 收入明细
      income: incomeResult,
      grossIncome,
      
      // 扣除明细
      specialDeductions: specialResult,
      additionalDeductions: additionalResult,
      totalDeductions,
      threshold: TAX_RULES.threshold,
      
      // 计税结果
      taxableIncome,
      taxRate: bracket.rate,
      taxRatePercent: bracket.rate * 100,
      quickDeduction: bracket.deduction,
      taxLevel: bracket.level,
      taxAmount: Math.round(taxAmount * 100) / 100,
      
      // 最终结果
      afterTaxIncome: Math.round(afterTaxIncome * 100) / 100
    };
  }
}
