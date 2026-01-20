// 专项附加扣除标准常量
export const DEDUCTION_STANDARDS = {
  // 子女教育
  childEducation: {
    name: '子女教育',
    monthly: 1000,
    yearly: 12000,
    description: '每个子女每月1000元'
  },
  
  // 继续教育
  continuingEducation: {
    name: '继续教育',
    academic: {
      monthly: 400,
      yearly: 4800,
      description: '学历继续教育每月400元'
    },
    professional: {
      yearly: 3600,
      description: '职业资格继续教育3600元/年'
    }
  },
  
  // 大病医疗
  seriousIllness: {
    name: '大病医疗',
    maxYearly: 80000,
    description: '据实扣除，年度上限80000元'
  },
  
  // 住房贷款利息
  housingLoan: {
    name: '住房贷款利息',
    monthly: 1000,
    yearly: 12000,
    description: '每月1000元，最长240个月'
  },
  
  // 住房租金（按城市分级）
  housingRent: {
    name: '住房租金',
    levels: {
      tier1: { monthly: 1500, yearly: 18000, description: '直辖市、省会、计划单列市' },
      tier2: { monthly: 1100, yearly: 13200, description: '市辖区户籍人口>100万' },
      tier3: { monthly: 800, yearly: 9600, description: '市辖区户籍人口≤100万' }
    }
  },
  
  // 赡养老人
  elderlySupport: {
    name: '赡养老人',
    monthly: 2000,
    yearly: 24000,
    description: '独生子女每月2000元'
  },
  
  // 婴幼儿照护
  childCare: {
    name: '婴幼儿照护',
    monthly: 1000,
    yearly: 12000,
    description: '3岁以下婴幼儿每月1000元'
  }
};

// 默认值配置
export const DEFAULT_VALUES = {
  salary: 180000,  // 工资薪金默认值
  months: 12       // 默认享受月份
};

// 月份选项
export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}个月`
}));

// 住房租金城市等级选项
export const RENT_CITY_OPTIONS = [
  { value: 'tier1', label: '直辖市/省会/计划单列市（1500元/月）' },
  { value: 'tier2', label: '人口>100万城市（1100元/月）' },
  { value: 'tier3', label: '人口≤100万城市（800元/月）' }
];

// 继续教育类型选项
export const EDUCATION_TYPE_OPTIONS = [
  { value: 'academic', label: '学历继续教育（400元/月）' },
  { value: 'professional', label: '职业资格继续教育（3600元/年）' }
];
