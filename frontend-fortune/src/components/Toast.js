let toastContainer = null;

function initContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

function getIcon(type) {
  const icons = {
    success: '\u2713',
    error: '\u2715',
    warning: '\u26A0',
    info: '\u2139'
  };
  return icons[type] || icons.info;
}

function show(message, type, duration) {
  if (type === undefined) type = 'info';
  if (duration === undefined) duration = 3000;
  
  initContainer();
  
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = '<span class="toast-icon">' + getIcon(type) + '</span><span class="toast-message">' + message + '</span>';
  
  toastContainer.appendChild(toast);
  
  requestAnimationFrame(function() {
    toast.classList.add('toast-show');
  });
  
  setTimeout(function() {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(function() { toast.remove(); }, 300);
  }, duration);
}

export const Toast = {
  show: show,
  success: function(message, duration) { show(message, 'success', duration); },
  error: function(message, duration) { show(message, 'error', duration); },
  warning: function(message, duration) { show(message, 'warning', duration); },
  info: function(message, duration) { show(message, 'info', duration); }
};
