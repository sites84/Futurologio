(() => {
  const timer = setInterval(() => {
    const button = document.getElementById('ftLoginBtn');
    const modal = document.getElementById('ftModal');
    if (!button || !modal) return;
    if (button.dataset.socialBridge === '1') return;
    button.dataset.socialBridge = '1';
    button.onclick = () => modal.classList.add('open');
  }, 250);
  setTimeout(() => clearInterval(timer), 30000);
})();
