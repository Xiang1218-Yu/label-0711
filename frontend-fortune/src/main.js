import './style.scss';
import { TaxCalculatorPage } from './pages/TaxCalculatorPage.js';

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const page = new TaxCalculatorPage(app);
  page.init();
});
