/**
 * 金额格式化工具
 */
export const Format = {
  /**
   * 格式化为千分位金额
   */
  currency(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    
    const num = parseFloat(value);
    return num.toLocaleString('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },
  
  /**
   * 格式化为整数金额（千分位）
   */
  currencyInt(value) {
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }
    
    const num = Math.round(parseFloat(value));
    return num.toLocaleString('zh-CN');
  },
  
  /**
   * 解析千分位金额为数字
   */
  parseCurrency(value) {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    
    // 移除千分位分隔符和空格
    const cleaned = String(value).replace(/[,\s]/g, '');
    const num = parseFloat(cleaned);
    
    return isNaN(num) ? 0 : num;
  },
  
  /**
   * 格式化百分比
   */
  percent(value, decimals = 0) {
    if (value === null || value === undefined || isNaN(value)) {
      return '0%';
    }
    
    return `${parseFloat(value).toFixed(decimals)}%`;
  },
  
  /**
   * 格式化税率显示
   */
  taxRate(rate) {
    return `${(rate * 100).toFixed(0)}%`;
  }
};
