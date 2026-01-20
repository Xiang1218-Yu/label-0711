// 2025年个人所得税计算规则
export const TAX_RULES = {
  // 年度起征点
  threshold: 60000,
  
  // 综合所得税率表
  brackets: [
    { min: 0, max: 36000, rate: 0.03, deduction: 0 },
    { min: 36000, max: 144000, rate: 0.10, deduction: 2520 },
    { min: 144000, max: 300000, rate: 0.20, deduction: 16920 },
    { min: 300000, max: 420000, rate: 0.25, deduction: 31920 },
    { min: 420000, max: 660000, rate: 0.30, deduction: 52920 },
    { min: 660000, max: 960000, rate: 0.35, deduction: 85920 },
    { min: 960000, max: Infinity, rate: 0.45, deduction: 181920 }
  ],
  
  // 收入额计算系数
  incomeCoefficients: {
    salary: 1,              // 工资薪金：全额
    laborService: 0.8,      // 劳务报酬：×0.8
    royalty: 0.56,          // 稿酬：×0.8×0.7
    license: 0.8            // 特许权使用费：×0.8
  }
};

// 根据应纳税所得额获取适用税率和速算扣除数
export function getTaxBracket(taxableIncome) {
  if (taxableIncome <= 0) {
    return { rate: 0, deduction: 0, level: 0 };
  }
  
  for (let i = 0; i < TAX_RULES.brackets.length; i++) {
    const bracket = TAX_RULES.brackets[i];
    if (taxableIncome <= bracket.max) {
      return {
        rate: bracket.rate,
        deduction: bracket.deduction,
        level: i + 1
      };
    }
  }
  
  const lastBracket = TAX_RULES.brackets[TAX_RULES.brackets.length - 1];
  return {
    rate: lastBracket.rate,
    deduction: lastBracket.deduction,
    level: 7
  };
}
