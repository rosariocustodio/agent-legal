// Interatividade da Landing Page "Claude para Abogados"
document.addEventListener('DOMContentLoaded', () => {
  // 1. Contador regressivo de 15 minutos
  const timerElements = document.querySelectorAll('.font-mono-ui.text-3xl.font-semibold.tabular-nums.text-gold');
  let timeLeft = 15 * 60; // 15 minutos em segundos

  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    const formatted = `${minutes}:${seconds}`;

    timerElements.forEach(el => {
      el.textContent = formatted;
    });

    if (timeLeft > 0) {
      timeLeft--;
    } else {
      timeLeft = 15 * 60; // reinicia ciclo
    }
  }

  if (timerElements.length > 0) {
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // 2. Notificação dinâmica de compra recente
  const toast = document.querySelector('div[role="status"]');
  if (toast) {
    const buyers = [
      { name: 'María González', country: 'México', time: 'hace 3 minutos' },
      { name: 'Dr. Sebastián Morales', country: 'Argentina', time: 'hace 5 minutos' },
      { name: 'Abg. Catalina Herrera', country: 'Colombia', time: 'hace 2 minutos' },
      { name: 'Carlos Mendoza', country: 'Chile', time: 'hace 7 minutos' },
      { name: 'Dra. Patricia Lima', country: 'Perú', time: 'hace 4 minutos' },
      { name: 'Andrés Villalba', country: 'Ecuador', time: 'hace 1 minuto' }
    ];

    let buyerIndex = 0;
    const nameEl = toast.querySelector('.font-medium:first-child');
    const countryEl = toast.querySelector('.font-medium:last-child');
    const timeEl = toast.querySelector('.text-\\[10px\\].text-muted-foreground');
    const closeBtn = toast.querySelector('button[aria-label="Cerrar notificación"]');

    let isDismissed = false;
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        isDismissed = true;
        hideToast();
      });
    }

    function showToast() {
      if (isDismissed) return;
      const b = buyers[buyerIndex];
      if (nameEl) nameEl.textContent = b.name;
      if (countryEl) countryEl.textContent = b.country;
      if (timeEl) timeEl.textContent = b.time;

      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
      toast.style.pointerEvents = 'auto';

      setTimeout(hideToast, 4500);
      buyerIndex = (buyerIndex + 1) % buyers.length;
    }

    function hideToast() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-120%)';
      toast.style.pointerEvents = 'none';
    }

    // Exibir primeiro toast após 3 segundos, e a cada 9 segundos
    setTimeout(() => {
      showToast();
      setInterval(showToast, 9000);
    }, 3000);
  }

  // 3. Rolagem suave para âncoras internas
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
