/**
 * DOM操作工具
 */
export const DOM = {
  /**
   * 获取元素
   */
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },
  
  /**
   * 获取多个元素
   */
  $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },
  
  /**
   * 创建元素
   */
  create(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') {
        el.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === 'html') {
        el.innerHTML = value;
      } else if (key === 'text') {
        el.textContent = value;
      } else {
        el.setAttribute(key, value);
      }
    });
    
    children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    });
    
    return el;
  },
  
  /**
   * 添加类名
   */
  addClass(el, ...classes) {
    el.classList.add(...classes);
  },
  
  /**
   * 移除类名
   */
  removeClass(el, ...classes) {
    el.classList.remove(...classes);
  },
  
  /**
   * 切换类名
   */
  toggleClass(el, className, force) {
    return el.classList.toggle(className, force);
  },
  
  /**
   * 显示元素
   */
  show(el) {
    el.style.display = '';
  },
  
  /**
   * 隐藏元素
   */
  hide(el) {
    el.style.display = 'none';
  },
  
  /**
   * 淡入动画
   */
  fadeIn(el, duration = 300) {
    el.style.opacity = '0';
    el.style.display = '';
    el.style.transition = `opacity ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      el.style.opacity = '1';
    });
  }
};
