/**
 * 输入校验器
 */
export class Validator {
  /**
   * 校验金额输入
   */
  static validateAmount(value, options = {}) {
    const { min = 0, max = Infinity, allowDecimal = true, fieldName = '金额' } = options;
    
    // 空值检查
    if (value === '' || value === null || value === undefined) {
      return { valid: true, value: 0, message: '' };
    }
    
    // 转换为数字
    const numValue = parseFloat(value);
    
    // 非数字检查
    if (isNaN(numValue)) {
      return { valid: false, value: 0, message: `${fieldName}必须为数字` };
    }
    
    // 负数检查
    if (numValue < min) {
      return { valid: false, value: numValue, message: `${fieldName}不能小于${min}` };
    }
    
    // 最大值检查
    if (numValue > max) {
      return { valid: false, value: numValue, message: `${fieldName}不能超过${max}` };
    }
    
    // 小数位检查
    if (!allowDecimal && !Number.isInteger(numValue)) {
      return { valid: false, value: numValue, message: `${fieldName}必须为整数` };
    }
    
    return { valid: true, value: numValue, message: '' };
  }
  
  /**
   * 校验月份选择
   */
  static validateMonths(value) {
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue) || numValue < 0 || numValue > 12) {
      return { valid: false, value: 0, message: '月份必须在0-12之间' };
    }
    
    return { valid: true, value: numValue, message: '' };
  }
  
  /**
   * 校验大病医疗金额
   */
  static validateSeriousIllness(value) {
    return this.validateAmount(value, {
      min: 0,
      max: 80000,
      fieldName: '大病医疗扣除'
    });
  }
  
  /**
   * 批量校验表单数据
   */
  static validateForm(formData) {
    const errors = [];
    
    // 校验收入项
    const incomeFields = ['salary', 'laborService', 'royalty', 'license'];
    incomeFields.forEach(field => {
      const result = this.validateAmount(formData.income?.[field], { fieldName: this.getFieldName(field) });
      if (!result.valid) {
        errors.push({ field: `income.${field}`, message: result.message });
      }
    });
    
    // 校验专项扣除
    const specialFields = ['pension', 'medical', 'unemployment', 'housingFund'];
    specialFields.forEach(field => {
      const result = this.validateAmount(formData.specialDeductions?.[field], { fieldName: this.getFieldName(field) });
      if (!result.valid) {
        errors.push({ field: `specialDeductions.${field}`, message: result.message });
      }
    });
    
    // 校验大病医疗
    if (formData.additionalDeductions?.seriousIllness?.amount) {
      const result = this.validateSeriousIllness(formData.additionalDeductions.seriousIllness.amount);
      if (!result.valid) {
        errors.push({ field: 'additionalDeductions.seriousIllness.amount', message: result.message });
      }
    }
    
    // 住房贷款利息与住房租金互斥校验（税法规定不能同时享受）
    const housingLoanMonths = formData.additionalDeductions?.housingLoan?.months || 0;
    const housingRentMonths = formData.additionalDeductions?.housingRent?.months || 0;
    if (housingLoanMonths > 0 && housingRentMonths > 0) {
      errors.push({
        field: 'additionalDeductions.housing',
        message: '住房贷款利息与住房租金在一个纳税年度内不能同时享受，请只选择一项填写'
      });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * 获取字段中文名
   */
  static getFieldName(field) {
    const names = {
      salary: '工资薪金',
      laborService: '劳务报酬',
      royalty: '稿酬',
      license: '特许权使用费',
      pension: '养老保险',
      medical: '医疗保险',
      unemployment: '失业保险',
      housingFund: '住房公积金'
    };
    return names[field] || field;
  }
}
