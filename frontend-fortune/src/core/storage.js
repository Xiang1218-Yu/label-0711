/**
 * 本地存储管理
 */
const STORAGE_KEY = 'tax_calculator_2025';

export class Storage {
  /**
   * 保存计算记录
   */
  static saveRecord(data) {
    try {
      const records = this.getRecords();
      const record = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        data
      };
      
      records.unshift(record);
      
      // 最多保存10条记录
      if (records.length > 10) {
        records.pop();
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return true;
    } catch (e) {
      console.warn('保存记录失败:', e);
      return false;
    }
  }
  
  /**
   * 获取所有记录
   */
  static getRecords() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('读取记录失败:', e);
      return [];
    }
  }
  
  /**
   * 获取最近一条记录
   */
  static getLastRecord() {
    const records = this.getRecords();
    return records.length > 0 ? records[0] : null;
  }
  
  /**
   * 清空所有记录
   */
  static clearRecords() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      console.warn('清空记录失败:', e);
      return false;
    }
  }
  
  /**
   * 删除指定记录
   */
  static deleteRecord(id) {
    try {
      const records = this.getRecords();
      const filtered = records.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.warn('删除记录失败:', e);
      return false;
    }
  }
}
